import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ModsService } from './mods.service';
import { AddNewModDto } from 'src/common/dto/mod.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('v1/mods')
export class ModsController {
  constructor(private readonly modsService: ModsService) {}

  @Get()
  async getModList() {
    return this.modsService.getModList();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TECH_ADMIN', 'TECH_MODERATOR')
  @Post()
  async addNewMod(@Body() body : AddNewModDto) {
    return this.modsService.addNewMod(body.title, body.url);
  }
}
