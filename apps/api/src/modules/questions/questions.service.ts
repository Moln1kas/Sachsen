import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { text } = createQuestionDto;

    return await this.prisma.question.create({
      data: {
        text,
      }
    });
  }

  async findAll() {
    return await this.prisma.question.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
