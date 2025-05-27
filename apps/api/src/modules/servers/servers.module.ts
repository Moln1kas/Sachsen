import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { ModsModule } from './mods/mods.module';

@Module({
  imports: [ModsModule],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}