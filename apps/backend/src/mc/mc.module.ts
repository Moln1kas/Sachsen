import { Module } from '@nestjs/common';
import { McController } from './mc.controller';
import { McService } from './mc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [McController],
  providers: [McService],
})
export class McModule {}
