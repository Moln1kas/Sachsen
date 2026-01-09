import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ConnectionsService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async registerMiddleware(server: any) {
    server.use(async (client, next) => {
      const userId = client.data.userId;

      if (!userId) {
        return next(new Error('UNAUTHORIZED'));
      }

      const isBanned = await this.redisService.get(`user:${userId}:banned`);
      if (isBanned) {
        client.emit('user:banned');
        client.disconnect();
        return;
      }

      next();
    });
  }

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
      const user = await this.usersService.findById(userId);

      if (user.status === 'BANNED') {
        client.disconnect();
        return;
      }

      client.data.userId = userId;

      await this.redisService.set(`user:${userId}:online`, 'true');
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
