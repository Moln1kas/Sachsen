import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { EmailConfirmService } from './email-confirm/email-confirm.service';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailConfirmService: EmailConfirmService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto): Promise<SignUpResponseDto> {
    const { email, username, password, answers }: SignUpDto = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await this.prisma.user.findUnique({ 
      where: { email }
    });
    if(existingUserByEmail) {
      throw new ConflictException('Введеная вами почта уже занята кем-то другим');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({ 
      where: { username }
    });
    if(existingUserByUsername) {
      throw new ConflictException('Введеный вами никнейм уже занят кем-то другим');
    }

    const questions = await this.prisma.question.findMany();
    if (signUpDto.answers.length !== questions.length) {
      throw new BadRequestException('Количество ответов не совпадает с количеством вопросов');
    }

    const answeredQuestionIds = signUpDto.answers.map(a => a.questionId);
    const uniqueQuestionIds = new Set(answeredQuestionIds);

    if (uniqueQuestionIds.size !== questions.length) {
      throw new BadRequestException('Вы не можете ответить на один и тот же вопрос дважды');
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        answers: {
          create: answers.map(answer => ({
            questionId: Number(answer.questionId),
            answerText: answer.answerText,
          })),
        },
      },
    });

    this.emailConfirmService.sendVerificationToken(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      status: newUser.status,
      isEmailVerified: newUser.isEmailVerified,
      role: newUser.role,
      message:
        'Вы успешно прошли первый этап регистрации. ' +
        'Проверьте свою почту на наличие нашего сообщения для ее подтверждения. ' +
        'После выполнения верификации своей почты ожидайте проверки вашего аккаунта нашим администратором.'
    };
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password }: SignInDto = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if(!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверные данные для входа');
    }

    if(!user.isEmailVerified) {
      this.emailConfirmService.sendVerificationToken(user);
      throw new UnauthorizedException('Сперва вы должны подтвердить свою почту');
    }

    const tokens = await this.generateTokens(user);

    return {
      refresh_token: tokens.refreshToken,
      access_token: tokens.accessToken,
      message:
        'Вы успешно вошли в свой аккаунт.',
    };
  }

  async logout(userId: number) {
    await this.redisService.del(`refresh:${userId}`);
    return { message: 'Вы успешно вышли из аккаунта' };
  }

  async deleteAccount(userId: number) {
    await this.redisService.del(`refresh:${userId}`);

    await this.prisma.answer.deleteMany({
      where: { userId },
    });

    await this.prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'Вы успешно удалили свой аккаунт' }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const storedToken = await this.redisService.get(`refresh:${userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Недействительный refresh токен');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const tokens = await this.generateTokens(user);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async generateTokens(user: User) {
    const payload = { 
      sub: user.id, 
      username: user.username,
      role: user.role,
      status: user.status
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<number>('JWT_ACCESS_LIFETIME')
,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<number>('JWT_REFRESH_LIFETIME'),
      }),
    ]);

    await this.redisService.set(`refresh:${user.id}`, refreshToken, 'EX', this.getRefreshTtl());

    return { accessToken, refreshToken };
  }

  private getRefreshTtl(): number {
    const lifetime = this.configService.get<string>('JWT_REFRESH_LIFETIME');
    const matches = lifetime.match(/^(\d+)([smhd])$/);
    if (!matches) return 604800;

    const [_, value, unit] = matches;
    const num = parseInt(value);
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return num * multipliers[unit];
  }
}
