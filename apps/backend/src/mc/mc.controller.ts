import { Controller, Get, UseGuards, Request, Body, Post } from '@nestjs/common';
import { McService } from './mc.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UpdateLauncherDto } from 'src/common/dto/mc.dto';

@Controller('v1/mc')
export class McController {
  constructor(private readonly mcService: McService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PLAYER')
  @Get()
  async checkRole(@Request() req) {
    return;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PLAYER')
  @Get('version')
  async getVersion() {
    return { launcher_version: await this.mcService.getLauncherVersion() }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MC_ADMIN')
  @Post('version')
  async updateLauncherVersion(@Body() body: UpdateLauncherDto) {
    return await this.mcService.updateLauncherVersion(body.launcher_version);
  }
}
