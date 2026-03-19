import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from '@prisma/client';

@Controller('servers')
export class ServersController {
  constructor(
    private readonly serversService: ServersService
  ) {}

  @Get()
  async findAll(): Promise<Server[]> {
    return await this.serversService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Server> {
    return await this.serversService.findById(id);
  }
}
