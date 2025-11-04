import { Module } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { SkinsController } from './skins.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SkinsController],
  providers: [SkinsService],
})
export class SkinsModule {}
