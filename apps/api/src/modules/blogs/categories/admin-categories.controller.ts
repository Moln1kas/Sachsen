import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { Status } from 'src/common/decorators/status.decorator';
import { StatusGuard } from 'src/common/guards/status.guard';

@Controller('admin/blogs/categories')
export class AdminCategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard, 
    RolesGuard,
    StatusGuard,
  )
  @Role('OWNER', 'ADMIN')
  @Status('APPROVED')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard, 
    RolesGuard,
    StatusGuard,
  )
  @Role('OWNER', 'ADMIN')
  @Status('APPROVED')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.delete(id);
  }
}