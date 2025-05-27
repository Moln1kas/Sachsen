import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from '@prisma/client';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { StatusGuard } from 'src/common/guards/status.guard';
import { Status } from 'src/common/decorators/status.decorator';

@Controller('servers')
export class ServersController {
  constructor(
    private readonly serversService: ServersService
  ) {}

  @UseGuards(
    JwtAuthGuard, 
    RolesGuard,
    StatusGuard,
  )
  @Role('ADMIN')
  @Status('APPROVED')
  @Post()
  async create(@Body() dto: CreateServerDto): Promise<Server> {
    return await this.serversService.create(dto);
  }

  @Get()
  async findAll(): Promise<Server[]> {
    return await this.serversService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Server> {
    return await this.serversService.findById(id);
  }

  @UseGuards(
    JwtAuthGuard, 
    RolesGuard,
    StatusGuard,
  )
  @Role('ADMIN')
  @Status('APPROVED')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServerDto,
  ) {
    return await this.serversService.update(id, dto);
  }
  
  @UseGuards(
    JwtAuthGuard, 
    RolesGuard,
    StatusGuard,
  )
  @Role('ADMIN')
  @Status('APPROVED')
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.serversService.delete(id);
  }
}
