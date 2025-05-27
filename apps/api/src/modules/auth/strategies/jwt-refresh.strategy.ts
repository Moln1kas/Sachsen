import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const storedToken = await this.redisService.get(`refresh:${payload.sub}`);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Недействительный refresh токен');
    }
    return payload;
  }
}
