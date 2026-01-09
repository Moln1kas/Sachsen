import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor (
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const { title } = dto;

    const isCategoryExists = await this.prismaService.category.findUnique({
      where: {
        title,
      }
    })
    if(isCategoryExists) throw new ConflictException('Категория с таким названием уже существует.');

    return await this.prismaService.category.create({
      data: {
        title,
      },
    });
  }

  async findMany() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }
}