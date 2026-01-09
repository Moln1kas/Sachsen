import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ModsService } from './mods.service';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';

@Controller('servers/:serverId/mods')
export class ModsController {
  constructor(private readonly modsService: ModsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('OWNER')
  @Post()
  create(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Body() dto: CreateModDto,
  ) {
    return this.modsService.create(serverId, dto);
  }

  @Get()
  findAll(@Param('serverId', ParseIntPipe) serverId: number) {
    return this.modsService.findAll(serverId);
  }

  @Get(':modId')
  findById(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Param('modId', ParseIntPipe) modId: number,
  ) {
    return this.modsService.findById(serverId, modId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('OWNER')
  @Patch(':modId')
  update(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Param('modId', ParseIntPipe) modId: number,
    @Body() dto: UpdateModDto,
  ) {
    return this.modsService.update(serverId, modId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('OWNER')
  @Delete(':modId')
  delete(
    @Param('serverId', ParseIntPipe) serverId: number,
    @Param('modId', ParseIntPipe) modId: number,
  ) {
    return this.modsService.delete(serverId, modId);
  }
}
