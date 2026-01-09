import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/common/redis/redis.module';
import { AdminUsersController } from './admin-users.controller';

@Module({
  controllers: [UsersController, AdminUsersController],
  imports: [PrismaModule, RedisModule],
  providers: [UsersService],
})
export class UsersModule {}
