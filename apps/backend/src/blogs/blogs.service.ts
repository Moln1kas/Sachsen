import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Blog, Prisma } from '@prisma/client';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async postNewBlog(title: string, content: string): Promise<Blog> {
    return await this.prisma.blog.create({ 
      data: { title, content }
    });
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.prisma.blog.findMany();
  }

  async getOneOfBlogs(where: Prisma.BlogWhereUniqueInput): Promise<Blog | null> {
    return await this.prisma.blog.findUnique({ where });
  }

  async deleteBlog(where: Prisma.BlogWhereUniqueInput): Promise<Blog> {
    return await this.prisma.blog.delete({ where });
  }
}
