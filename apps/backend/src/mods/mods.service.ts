import { Injectable } from '@nestjs/common';
import { Mod } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModsService {
  constructor(private readonly prisma: PrismaService) {}

  async getModList() : Promise<Mod[]> {
    return await this.prisma.mod.findMany();
  }

  async addNewMod(title: string, url: string) : Promise<Mod> {
    return await this.prisma.mod.create({
      data: { title, url }
    });
  }
}
