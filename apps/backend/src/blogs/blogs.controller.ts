import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { PostNewBlogDto } from './dto/post-blog.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('v1/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Found the blogs' })
  async getAllBlogs() {
    return this.blogsService.getAllBlogs();
  }


  @Get(':id')
  async getOneOfBlogs(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getOneOfBlogs({ id: Number(id) });
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR', 'TECH_MODERATOR','TECH_ADMINISTRATOR')
  @Post()
  async postNewBlog(@Body() body: PostNewBlogDto) {
    return this.blogsService.postNewBlog(body.title, body.content);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR', 'TECH_MODERATOR','TECH_ADMINISTRATOR')
  @Delete(':id')
  async deleteBlog(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.deleteBlog({ id: Number(id) });
  }
}
