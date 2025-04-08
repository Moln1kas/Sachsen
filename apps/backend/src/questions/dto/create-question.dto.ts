import { IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @Length(3, 255)
  text: string;
}