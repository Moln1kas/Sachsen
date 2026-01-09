import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username }
    });

    if(!user) throw new NotFoundException('Пользователь не найден в базе данных.');

    return user;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email }
    })
  }

  async findById(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id }
    })
  }

  async findMany({ skip, take }: { skip: number, take: number }) {
    return this.prismaService.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count() {
    return this.prismaService.blog.count();
  }

  async getUserOnlineStatus(id: number) {
    return await this.redisService.get(`user:${id}:online`);
  }

  async banUser(reqId: number, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    });

    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете забанить самого себя.');
    }

    if(user.status === 'BANNED') {
      throw new BadRequestException('Пользователь уже забанен.');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'BANNED',
      }
    });

    return { id: user.id, status: 'BANNED' };
  }

  async unbanUser(reqId: number, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    });

    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете разбанить самого себя.');
    }

    if(user.status !== 'BANNED') {
      throw new BadRequestException('Пользователь и так не забанен.');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'APPROVED',
      }
    });

    return { id: user.id, status: 'APPROVED' };
  }
}
