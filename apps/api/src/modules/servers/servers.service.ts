import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Server } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServerDto): Promise<Server> {
    const existing = await this.prisma.server.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Сервер с таким именем уже существует');

    const modsSet = new Set<string>();
    for (const mod of dto.mods || []) {
      const key = mod.name.trim().toLowerCase();
      if (modsSet.has(key)) {
        throw new ConflictException(`Мод '${mod.name}' дублируется`);
      }
      modsSet.add(key);
    }

    return this.prisma.server.create({
      data: {
        name: dto.name,
        description: dto.description,
        serverAddress: dto.serverAddress,
        minecraftVersion: dto.minecraftVersion,
        javaVersion: dto.javaVersion,
        mods: {
          create: dto.mods?.map((mod) => ({
            name: mod.name,
            downloadUrl: mod.downloadUrl,
          })) || [],
        },
      },
      include: { mods: true },
    });
  }

  async findAll(): Promise<Server[]> {
    return this.prisma.server.findMany({
      include: { mods: true },
    });
  }

  async findById(id: number): Promise<Server> {
    const server = await this.prisma.server.findUnique({
      where: { id },
      include: { mods: true },
    });

    if (!server) throw new NotFoundException('Сервер не найден');
    return server;
  }

  async update(id: number, dto: UpdateServerDto): Promise<Server> {
    const server = await this.prisma.server.findUnique({ where: { id }, include: { mods: true } });
    if (!server) throw new NotFoundException('Сервер не найден');

    if (dto.mods) {
      const modsSet = new Set<string>();
      for (const mod of dto.mods) {
        const key = mod.name.trim().toLowerCase();
        if (modsSet.has(key)) {
          throw new ConflictException(`Мод '${mod.name}' дублируется`);
        }
        modsSet.add(key);
      }

      await this.prisma.mod.deleteMany({ where: { serverId: id } });
    }

    await this.prisma.server.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        serverAddress: dto.serverAddress,
        minecraftVersion: dto.minecraftVersion,
        javaVersion: dto.javaVersion,
        mods: dto.mods
          ? {
              create: dto.mods.map((mod) => ({
                name: mod.name,
                downloadUrl: mod.downloadUrl,
              })),
            }
          : undefined,
      },
    });

    return this.findById(id);
  }

  async delete(id: number) {
    const server = await this.findById(id);
    if (!server) throw new NotFoundException('Сервер не найден');

    await this.prisma.server.delete({
      where: { id },
    });

    return { success: true };
  }
}
