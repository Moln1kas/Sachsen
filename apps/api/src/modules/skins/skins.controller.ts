import { Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { StatusGuard } from 'src/common/guards/status.guard';
import { Status } from 'src/common/decorators/status.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { File } from 'src/common/decorators/file.decorator';
import { MultipartFile } from '@fastify/multipart';

@Controller('skins')
export class SkinsController {
  constructor(private readonly skinsService: SkinsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, StatusGuard)
  @Status('APPROVED')
  async uploadSkin(@CurrentUser() reqUser: { sub: number }, @File() file: MultipartFile) {
    return await this.skinsService.uploadSkin(reqUser.sub, file);
  }

  @Get(':username.json') // API FOR CUSTOM SKIN LOADER
  async getSkin(@Param('username') username: string) {
    const data = await this.skinsService.getSkin(username);
    if (!data) throw new NotFoundException('Пользователь не найден');
    return data;
  }

  @Get('textures/:username') // API FOR CUSTOM SKIN LOADER
  async getTexture(@Param('username') username: string) {
    return this.skinsService.serveTexture(username);
  }
}
