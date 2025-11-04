import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateFriendRequestDto } from './dto/create-friend.dto';
import { FriendshipStatus } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  async sendRequest(userId: number, dto: CreateFriendRequestDto) {
    const { friendId } = dto;

    if (userId === friendId)
      throw new BadRequestException("Нельзя добавить самого себя в друзья");

    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existing)
      throw new BadRequestException("Заявка уже существует или пользователи уже друзья");

    return this.prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: FriendshipStatus.PENDING,
      },
    });
  }

    async acceptRequest(userId: number, dto: CreateFriendRequestDto) {
    const { friendId } = dto;

    const request = await this.prisma.friendship.findFirst({
      where: { userId: friendId, friendId: userId, status: FriendshipStatus.PENDING },
    });

    if (!request)
      throw new NotFoundException("Заявка не найдена");

    return this.prisma.friendship.update({
      where: { id: request.id },
      data: { status: FriendshipStatus.ACCEPTED },
    });
  }

  async rejectRequest(userId: number, dto: CreateFriendRequestDto) {
    const { friendId } = dto;
    const request = await this.prisma.friendship.findFirst({
      where: { userId: friendId, friendId: userId, status: FriendshipStatus.PENDING },
    });

    if (!request)
      throw new NotFoundException("Заявка не найдена");

    return this.prisma.friendship.update({
      where: { id: request.id },
      data: { status: FriendshipStatus.REJECTED },
    });
  }

  async removeFriend(userId: number, dto: CreateFriendRequestDto) {
    const { friendId } = dto;
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId, status: FriendshipStatus.ACCEPTED },
          { userId: friendId, friendId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
    });

    if (!friendship)
      throw new NotFoundException("Дружба не найдена");

    await this.prisma.friendship.delete({ where: { id: friendship.id } });

    return { message: 'Пользователь удалён из друзей' };
  }

  async getFriendsRequests(userId: number) {
    const users = await this.prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        user: true,
        friend: true,
      },
    });

    return users.map(f => (f.userId === userId ? f.friend : f.user));
  }

  async getFriends(userId: number) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: FriendshipStatus.ACCEPTED },
          { friendId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        user: true,
        friend: true,
      },
    });

    return friendships.map(f => (f.userId === userId ? f.friend : f.user));
  }
}
