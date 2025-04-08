import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interface/jwtPayload.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Некорректный токен');
    }    
    const user = await this.prisma.user.findUnique({ 
      where: { id: payload.sub },
      include: { roles: { include: { role: true } } },
    });    
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return { userId: user.id, username: user.username, roles: user.roles.map(r => r.role.value) }; 
  }
}