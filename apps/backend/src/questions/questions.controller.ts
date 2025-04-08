import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  @Post()
  async createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionsService.createQuestion(dto);
  }

  @Get()
  async getQuestions() {
    return this.questionsService.getQuestions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  @Delete(':id')
  async deleteQuestion(@Param('id') id: number) {
    return this.questionsService.deleteQuestion(id);
  }
}
