import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users/users.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule, RedisModule],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
})
export class FriendsModule {}
