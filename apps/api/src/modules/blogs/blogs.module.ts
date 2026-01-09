import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogsGateway } from './blogs.gateway';
import { CategoriesModule } from './categories/categories.module';
import { AdminBlogsController } from './admin-blogs.controller';

@Module({
  imports: [CategoriesModule],
  controllers: [BlogsController, AdminBlogsController],
  providers: [BlogsService, BlogsGateway],
})
export class BlogsModule {}
