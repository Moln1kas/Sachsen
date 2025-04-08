import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Launcher, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class McService {
  constructor(private readonly prisma: PrismaService) {}

  async getLauncherVersion(): Promise<string> {
    const minecraft = await this.prisma.launcher.findFirst({ orderBy: {
      created_at: 'desc'
    } });
  
    return minecraft.version.length > 0 ? minecraft.version : '1.0.0';
  }    

  async updateLauncherVersion(version: string): Promise<Launcher> {
    const existingVersion = await this.prisma.launcher.findUnique({
      where: { version }
    });

    if(existingVersion) throw new ConflictException('Данная версия уже существует');

    return await this.prisma.launcher.create({ data: {
      version,
    } });
  }
}
