import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'role',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const reqUser = context.switchToHttp().getRequest().user;

    if (!reqUser) {
      throw new ForbiddenException('Пользователь не найден в запросе');
    }

    const user = await this.prismaService.user.findUnique({ 
      where: { id: reqUser.sub } 
    });

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}  