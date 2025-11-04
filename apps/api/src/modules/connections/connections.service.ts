import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class ConnectionsService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async connectionHandler(client: any) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      await this.redisService.set(`user:${userId}:online`, 'true');
      client.data.userId = userId;
    } catch (e) {
      client.disconnect();
    }
  }

  async disconnectionHandler(client: any) {
    const userId = client.data.userId;
    if (userId) {
      await this.redisService.del(`user:${userId}:online`);
    }
  }
}
