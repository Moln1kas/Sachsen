import { MultipartFile } from '@fastify/multipart';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import { PassThrough } from 'stream';
import Sharp from 'sharp';
import { createHash } from 'crypto';
import { rename } from 'fs/promises';

@Injectable()
export class SkinsService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async uploadSkin(userId: number, file: MultipartFile) {
    if(!file) throw new BadRequestException('Необходимо загрузить файл');

    const storagePath = await this.configService.getOrThrow('SKINS_STORAGE_PATH');
    const baseUrl = await this.configService.getOrThrow('SKINS_BASE_URL');

    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    })
    if(!user) throw new NotFoundException('Пользователь с таким ID не найден.');

    const stream = file.file;
    const chunk = await stream.read(4100);
    if (!chunk) throw new BadRequestException('Пустой файл');

    const ft = await fileTypeFromBuffer(chunk);
    if (!ft || ft.mime !== 'image/png') {
      throw new BadRequestException('Файл должен быть PNG');
    }

    try {
      const metadata = await Sharp(chunk).metadata();
      if (metadata.width !== 64 || metadata.height !== 64) {
        throw new BadRequestException('Размер изображения должен быть строго 64x64 пикселя.');
      }
    } catch (err) {
      throw new BadRequestException('Не удалось прочитать изображение. Возможно, файл повреждён.');
    }

    const filePath = join(
      storagePath,
      `${user.username}.png`
    );
    
    const pass = new PassThrough();
    pass.write(chunk);
    stream.pipe(pass);
    
    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      pass.pipe(writeStream);

      pass.on('error', reject);
      writeStream.on('error', reject);

      writeStream.on('finish', () => resolve());
    });

    return { url: `${baseUrl}/${user.username}.png` };
  }

  async getSkin(username: string) {
    const storagePath = await this.configService.getOrThrow('SKINS_STORAGE_PATH');

    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) return null;

    const skinPath = join(storagePath, `${user.username}.png`);
    if (!existsSync(skinPath)) return null;

    return {
      username: user.username,
      skin: user.username, // Как-то некрасиво
    };
  }

  async serveTexture(username: string) {
    const storagePath = await this.configService.getOrThrow('SKINS_STORAGE_PATH');

    const filePath = join(storagePath, `${username}.png`);
    if (!existsSync(filePath)) throw new NotFoundException();

    return createReadStream(filePath);
  }
}
