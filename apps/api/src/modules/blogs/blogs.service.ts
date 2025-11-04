import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor (
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateBlogDto) {
    const { title, text, categoryId, isImportant } = dto;

    return await this.prismaService.blog.create({
      data: {
        title,
        text,
        isImportant,
        category: {
          connect: { id: categoryId },
        },
      }
    });
  }

  async findMany({ skip, take }: { skip: number, take: number }) {
    return this.prismaService.blog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async count() {
    return this.prismaService.blog.count();
  }

  async findOne(id: number) {
    return await this.prismaService.blog.findUnique({
      where: { id }
    });
  }

  async update(id: number, dto: UpdateBlogDto) {
    return;
  }

  async remove(id: number) {
    return;
  }
}
