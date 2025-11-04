import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogsGateway } from './blogs.gateway';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, BlogsGateway],
})
export class BlogsModule {}
