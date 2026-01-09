import { Controller, Get} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('blogs/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll() {
    return await this.categoriesService.findMany();
  }
}