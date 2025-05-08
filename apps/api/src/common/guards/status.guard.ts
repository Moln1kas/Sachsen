import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredStatus = this.reflector.get<UserStatus[]>(
      'status',
      context.getHandler(),
    );
    if (!requiredStatus) return true;

    const reqUser = context.switchToHttp().getRequest().user;

    if (!reqUser) {
      throw new ForbiddenException('Пользователь не найден в запросе');
    }

    const user = await this.prismaService.user.findUnique({ 
      where: { id: reqUser.sub } 
    });
  
    if (!requiredStatus.includes(user.status)) {
      switch (user.status) {
        case UserStatus.PENDING:
          throw new ForbiddenException('Ваш аккаунт ещё не одобрен администратором.');
        case UserStatus.BANNED:
          throw new ForbiddenException('Ваш аккаунт заблокирован.');
        case UserStatus.REJECTED:
          throw new ForbiddenException('Ваша регистрация была отклонена.');
        default:
          throw new ForbiddenException('Недопустимый статус пользователя.');
      }
    }

    return true;
  }
}  