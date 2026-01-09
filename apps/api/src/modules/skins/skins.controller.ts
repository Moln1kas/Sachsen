import { Controller, Get, NotFoundException, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
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

  @Get(':username.json')
  async getPlayer(
    @Param('username') username: string,
    @Res() res,
  ) {
    const result = await this.skinsService.getPlayerInfo(username);
    if (!result) throw new NotFoundException();

    res
      .header('Content-Type', 'application/json')
      .header('Cache-Control', 'public, max-age=300')
      .send(result);
  }

  @Get('textures/:id')
  async getTexture(
    @Param('id') id: string,
    @Req() req,
    @Res() res,
  ) {
    return this.skinsService.streamTexture(id, req, res);
  }
}
