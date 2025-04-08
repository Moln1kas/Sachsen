import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new UnauthorizedException('Пользователь не найден в данных запроса');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: { roles: { include: { role: true } } },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (dbUser.status !== 'APPROVED') {
      throw new ForbiddenException('Ваш аккаунт не подтвержден');
    }

    if (!requiredRoles) return true;

    const userRoles = dbUser.roles.map(r => r.role.value);
    return requiredRoles.some(role => userRoles.includes(role));
  }
}