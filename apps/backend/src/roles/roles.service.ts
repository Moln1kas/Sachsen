import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	async assignRole(userId: number, value: string) {
    const role = await this.prisma.role.findUnique({
      where: { value: value },
    });

    if (!role) throw new NotFoundException(`Роль ${value} не найдена`);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
    });

    if(!user) throw new NotFoundException(`Пользователь с ID ${userId} не найден`);

    const existingRole = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id,
        },
      },
    });

    if (existingRole) throw new ConflictException('Этот пользователь уже имеет такую роль');

    await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
    });

    return {message:`Роль ${value} успешно добавлена пользователю с id ${userId}`};
	}
}
