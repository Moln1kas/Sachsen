import { Module, forwardRef } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmController } from './email-confirm.controller';
import { MailModule } from 'src/common/mail/mail.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthModule } from '../auth.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => MailModule),
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RedisModule),
    forwardRef(() => JwtModule),
  ],
  controllers: [EmailConfirmController],
  providers: [EmailConfirmService, PrismaService, AuthService, UsersService],
  exports: [EmailConfirmService],
})
export class EmailConfirmModule {}
