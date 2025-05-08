import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '@prisma/client';

class AnswerDto {
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  answerText: string;
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class SignUpResponseDto {
  id: number;
  email: string;
  username: string;
  status: UserStatus;
  isEmailVerified: boolean;
  role: UserRole;
  message: string;
}
