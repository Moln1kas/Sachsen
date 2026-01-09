import { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { createReadStream, existsSync, statSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import * as fs from 'fs/promises';
import Sharp from 'sharp';
import { createHash } from 'crypto';
import { httpDate, notModified } from './skins.utils';

@Injectable()
export class SkinsService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async uploadSkin(userId: number, file: MultipartFile) {
    if (!file) {
      throw new BadRequestException('Необходимо загрузить файл');
    }

    const storagePath = this.configService.getOrThrow<string>('SKINS_STORAGE_PATH');
    const baseUrl = this.configService.getOrThrow<string>('SKINS_BASE_URL');

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const buffer = await file.toBuffer();
    if (!buffer.length) {
      throw new BadRequestException('Пустой файл');
    }

    const ft = await fileTypeFromBuffer(buffer);
    if (!ft || ft.mime !== 'image/png') {
      throw new BadRequestException('Файл должен быть PNG');
    }

    let metadata;
    try {
      metadata = await Sharp(buffer).metadata();
    } catch {
      throw new BadRequestException(
        'Не удалось прочитать изображение',
      );
    }

    if (metadata.width !== 64 || metadata.height !== 64) {
      throw new BadRequestException(
        'Размер изображения должен быть 64x64 пикселя',
      );
    }

    const hash = createHash('sha256')
      .update(buffer)
      .digest('hex');

    const filePath = join(storagePath, `${hash}.png`);

    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, buffer);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { skinHash: hash },
    });

    return {
      texture: `${baseUrl}/textures/${hash}`,
      hash,
    };
  }

  async getPlayerInfo(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user || !user.skinHash) return null;

    return {
      username: user.username,
      textures: {
        default: user.skinHash,
      },
    };
  }

  async streamTexture(
    id: string,
    req,
    res,
  ) {
    const storage = this.configService.getOrThrow('SKINS_STORAGE_PATH');
    const filePath = join(storage, `${id}.png`);

    if (!existsSync(filePath)) throw new NotFoundException();

    const stat = statSync(filePath);

    if (notModified(req.headers['if-modified-since'], stat.mtime)) {
      return res.status(304).send();
    }

    res
      .header('Content-Type', 'image/png')
      .header('Content-Length', stat.size)
      .header('Last-Modified', httpDate(stat.mtime))
      .header('Cache-Control', 'public, max-age=86400');

    return res.send(createReadStream(filePath));
  }
}
