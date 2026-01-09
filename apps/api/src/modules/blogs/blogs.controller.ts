import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
  ) {}
  @Get()
  async findAll(
    @Query('page') pageQuery: string = '1',
    @Query('limit') limitQuery: string = '10',
  ) {
    const page = Math.max(Number(pageQuery) || 1, 1);
    const limit = Math.max(Number(limitQuery) || 10, 1);

    const skip = (page - 1) * limit;
    const blogs = await this.blogsService.findMany({ skip, take: limit });
    const total = await this.blogsService.count();

    return { total, page, limit, blogs };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.blogsService.findOne(id);
  }
}
