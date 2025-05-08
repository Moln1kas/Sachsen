import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TokenType, User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailConfirmDto } from './dto/confirm.dto';
import { MailService } from 'src/common/mail/mail.service';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailConfirmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  public async newVerification(req: Request, token: string) {
    const existingToken = await this.prisma.token.findUnique({
      where: {
        token: token,
        type: TokenType.VERIFICATION
      }
    });

    if(!existingToken) {
      throw new NotFoundException(
        'Токен подтверждения не найден. Возможно ваш токен истек или вы уже его применили. В первом случае вы можете запросить новый токен подтверждения отправив запрос на авторизацию.'
      );
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if(isExpired) {
      throw new BadRequestException('Токен подтверждения истек.');
    }

    const existingUser = await this.usersService.findByEmail(
      existingToken.email
    );

    if(!existingUser) {
      throw new NotFoundException('Пользователь с указанным адресом электронной почты не найден.');
    }

    await this.prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        isEmailVerified: true
      }
    });

    await this.prisma.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION
      }
    });

    return 'Вы успешно подтвердили свой адрес электронной почты. Теперь вы можете войти в свой аккаунт.';
  }

  public async sendVerificationToken(user: User) {
    const verificationToken = await this.genVerificationToken(user.email);
    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return true;
  }

  private async genVerificationToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600*1000);
    const existingToken = await this.prisma.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION
      }
    })

    if(existingToken) {
      await this.prisma.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION
        }
      });
    }
    
    const verificationToken = await this.prisma.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION
      }
    });

    return verificationToken;
  }
}
