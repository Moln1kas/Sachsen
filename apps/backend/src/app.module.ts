import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlogModule } from './blogs/blogs.module';
import { McModule } from './mc/mc.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { QuestionsModule } from './questions/questions.module';
import { ModsModule } from './mods/mods.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BlogModule,
    McModule,
    ModsModule,
    AuthModule,
    PrismaModule,
    RolesModule,
    QuestionsModule
  ],
})
export class AppModule {}
