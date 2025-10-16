import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
