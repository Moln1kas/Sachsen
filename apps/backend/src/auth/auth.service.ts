import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto, RegisterResponseDto, LoginResponseDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { username, password, answers } = dto;
  
    const existingUser = await this.prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('Этот никнейм уже занят');
    }

    const questions = await this.prisma.question.findMany();
    if (!answers || answers.length !== questions.length) throw new BadRequestException('Ответьте на все вопросы.');
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        status: 'PENDING',
        answers: {
          create: answers.map(a => ({
            questionId: a.questionId,
            response: a.response,
          })),
        },
      },
    });
  
    return { message: 'Заявка отправлена на рассмотрение' };
  }  

  async approveRegistration(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'PENDING') {
      throw new NotFoundException('Заявка не найдена или уже обработана');
    }
  
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'APPROVED',
        roles: { create: [{ role: { connect: { value: 'PLAYER' } } }] },
      },
    });
  
    return { message: 'Заявка подтверждена' };
  }  

  async rejectRegistration(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'PENDING') {
      throw new NotFoundException('Заявка не найдена или уже обработана');
    }
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'REJECTED' },
    });
  
    return { message: 'Заявка отклонена' };
  }  

  async deleteAccount(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if(user.username === this.configService.get<string>('ROOT_USERNAME')) throw new ForbiddenException('Нельзя удалить супер-пользователя!');

    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'Аккаунт удалён' };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = dto;
  
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверные данные для входа');
    }
  
    const payload = { 
      username: user.username, 
      sub: user.id, 
      roles: user.roles.map(r => r.role.value),
      approved: user.status === 'APPROVED'
    };
  
    return {
      message: 'Вы успешно вошли в аккаунт.',
      token: this.jwtService.sign(payload),
      approved: user.status === 'APPROVED',
    };
  }  
}
