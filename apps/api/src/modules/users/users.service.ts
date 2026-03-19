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
      where: { username },
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        skinHash: true,
        applicationText: true,
        createdAt: true,
      }
    });

    if(!user) throw new NotFoundException('Пользователь не найден в базе данных.');

    return user;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        isEmailVerified: true,
        role: true,
        status: true,
        skinHash: true,
        applicationText: true,
        createdAt: true,
      }
    })
  }

  async findById(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        isEmailVerified: true,
        role: true,
        status: true,
        skinHash: true,
        applicationText: true,
        createdAt: true,
      }
    })
  }

  async findMany({ skip, take }: { skip: number, take: number }) {
    return this.prismaService.user.findMany({
      skip,
      take: Math.min(take, 100),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        isEmailVerified: true,
        role: true,
        status: true,
        skinHash: true,
        applicationText: true,
        createdAt: true,
      },
    });
  }

  async count() {
    return this.prismaService.user.count();
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

    const adminUser = await this.prismaService.user.findUnique({
      where: {
        id: reqId,
      }
    });

    if(!adminUser) throw new NotFoundException('Вы не найдены в базе данных.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете забанить самого себя.');
    }

    if(user.role === 'OWNER') {
      throw new BadRequestException('Вы не можете забанить главу.');
    }

    if(adminUser.role !== 'OWNER' && user.role === 'ADMIN') {
      throw new BadRequestException('Вы не можете забанить администратора.');
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

  async approveUser(reqId: number,userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    });
    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете одобрить свою заявку.');
    }

    if(user.status === 'APPROVED') {
      throw new BadRequestException('Заявка уже одобрена.');
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

  async rejectUser(reqId: number,userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    });
    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете отклонить свою заявку.');
    }

    if(user.status === 'REJECTED') {
      throw new BadRequestException('Заявка уже отклонена.');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'REJECTED',
      }
    });

    return { id: user.id, status: 'REJECTED' };
  }

  async setRole(
    reqId: number,
    userId: number,
    role: 'PLAYER' | 'ADMIN' | 'OWNER'
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      }
    });
    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    if(userId === reqId) {
      throw new BadRequestException('Вы не можете изменить свою роль.');
    }

    if(user.role === role) {
      throw new BadRequestException('Пользователь уже имеет эту роль.');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      }
    });

    return { id: user.id, role };
  }
}