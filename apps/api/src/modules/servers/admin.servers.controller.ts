import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ServersService } from './servers.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { Throttle } from '@nestjs/throttler';
import { StatusGuard } from 'src/common/guards/status.guard';
import { Status } from 'src/common/decorators/status.decorator';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from '@prisma/client';
import { UpdateServerDto } from './dto/update-server.dto';

@Controller('admin/servers')
@UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
export class AdminServersController {
  constructor(
    private readonly serversService: ServersService,
  ) {}

  @Role('OWNER')
  @Status('APPROVED')
  @Post()
  @Throttle({ default: { limit: 2, ttl: 120000 } })
  async create(@Body() dto: CreateServerDto): Promise<Server> {
    return await this.serversService.create(dto);
  }

  @Role('OWNER')
  @Status('APPROVED')
  @Patch(':id')
  @Throttle({ default: { limit: 2, ttl: 120000 } })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServerDto,
  ) {
    return await this.serversService.update(id, dto);
  }
  
  @Role('OWNER')
  @Status('APPROVED')
  @Delete(':id')
  @Throttle({ default: { limit: 2, ttl: 120000 } })
  delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.serversService.delete(id);
  }
}
