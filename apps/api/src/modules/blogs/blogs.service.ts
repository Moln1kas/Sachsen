import { BadRequestException, Injectable } from '@nestjs/common';
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

    const isCategoryExists = await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })
    if(!isCategoryExists) throw new BadRequestException('Неверно указан ID категории.');

    return await this.prismaService.blog.create({
      data: {
        title,
        text,
        isImportant,
        category: {
          connect: { 
            id: categoryId,
          },
        },
      },
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
    return this.prismaService.blog.findUnique({
      where: { id },
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

  async update(id: number, dto: UpdateBlogDto) {
    const { categoryId, ...rest } = dto;

    return this.prismaService.blog.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
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

  async remove(id: number) {
    return this.prismaService.blog.delete({
      where: { id },
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
}
