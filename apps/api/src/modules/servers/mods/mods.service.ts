import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';

@Injectable()
export class ModsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(serverId: number, dto: CreateModDto) {
    const server = await this.prisma.server.findUnique({ where: { id: serverId } });
    if (!server) throw new NotFoundException('Сервер не найден');

    const exists = await this.prisma.mod.findFirst({
      where: {
        serverId,
        name: dto.name,
      },
    });

    if (exists) {
      throw new ConflictException(`Мод '${dto.name}' уже существует на этом сервере`);
    }

    return this.prisma.mod.create({
      data: {
        name: dto.name,
        modrinthModId: dto.modrinthModId,
        modrinthModVersionId: dto.modrinthModVersionId,
        serverId,
      },
    });
  }

  async findAll(serverId: number) {
    return this.prisma.mod.findMany({
      where: { serverId },
    });
  }

  async findById(serverId: number, modId: number) {
    const mod = await this.prisma.mod.findFirst({
      where: {
        id: modId,
        serverId,
      },
    });

    if (!mod) throw new NotFoundException('Мод не найден');
    return mod;
  }

  async update(serverId: number, modId: number, dto: UpdateModDto) {
    const mod = await this.prisma.mod.findFirst({
      where: {
        id: modId,
        serverId,
      },
    });

    if (!mod) throw new NotFoundException('Мод не найден');

    if (dto.name) {
      const conflict = await this.prisma.mod.findFirst({
        where: {
          serverId,
          name: dto.name,
          NOT: { id: modId },
        },
      });

      if (conflict) {
        throw new ConflictException(`Мод с именем '${dto.name}' уже существует на этом сервере`);
      }
    }

    return this.prisma.mod.update({
      where: { id: modId },
      data: {
        name: dto.name,
        modrinthModId: dto.modrinthModId,
        modrinthModVersionId: dto.modrinthModVersionId,
      },
    });
  }

  async delete(serverId: number, modId: number) {
    const mod = await this.prisma.mod.findFirst({
      where: {
        id: modId,
        serverId,
      },
    });

    if (!mod) throw new NotFoundException('Мод не найден для этого сервера');

    await this.prisma.mod.delete({ where: { id: modId } });

    return { success: true };
  }
}
