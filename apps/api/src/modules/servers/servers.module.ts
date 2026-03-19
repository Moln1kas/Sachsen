import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { ModsModule } from './mods/mods.module';
import { AdminServersController } from './admin.servers.controller';

@Module({
  imports: [ModsModule],
  controllers: [ServersController, AdminServersController],
  providers: [ServersService],
})
export class ServersModule {}