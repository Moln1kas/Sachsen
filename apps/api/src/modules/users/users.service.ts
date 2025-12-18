import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username }
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  async getUserOnlineStatus(id: number) {
    return await this.redisService.get(`user:${id}:online`);
  }
}
