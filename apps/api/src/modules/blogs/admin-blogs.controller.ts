import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsGateway } from './blogs.gateway';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsGateway: BlogsGateway,
  ) {}

  @Post()
  @Role('ADMIN')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Body() createBlogDto: CreateBlogDto) {
    const blog = await this.blogsService.create(createBlogDto);
    await this.blogsGateway.notifyBlogChanged(blog);
    return blog;
  }

  @Patch(':id')
  @Role('ADMIN')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogsService.update(id, updateBlogDto);
    await this.blogsGateway.notifyBlogChanged(blog);
    return blog;
  }

  @Delete(':id')
  @Role('ADMIN')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async remove(@Param('id') id: number) {
    const blog = await this.blogsService.remove(id);
    await this.blogsGateway.notifyBlogChanged(blog);
    return blog;
  }
}
