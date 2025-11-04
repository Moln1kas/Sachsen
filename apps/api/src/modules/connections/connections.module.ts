import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsGateway } from './connections.gateway';
import { RedisModule } from 'src/common/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule],
  providers: [ConnectionsGateway, ConnectionsService],
})
export class ConnectionsModule {}
