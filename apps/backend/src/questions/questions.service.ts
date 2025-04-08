import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: { text: dto.text },
    });
  }

  async getQuestions() {
    return this.prisma.question.findMany();
  }

  async deleteQuestion(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}