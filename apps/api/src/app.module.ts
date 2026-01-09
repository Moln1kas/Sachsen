import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { ServersModule } from './modules/servers/servers.module';
import { ModsModule } from './modules/servers/mods/mods.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { FriendsModule } from './modules/friends/friends.module';
import { SkinsModule } from './modules/skins/skins.module';
import { CategoriesModule } from './modules/blogs/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000,
          limit: 25,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ServersModule,
    ModsModule,
    QuestionsModule,
    BlogsModule,
    ConnectionsModule,
    FriendsModule,
    SkinsModule,
    CategoriesModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
