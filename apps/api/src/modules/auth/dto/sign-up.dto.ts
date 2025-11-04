import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, ValidateNested, IsArray, ArrayMinSize, MaxLength, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '@prisma/client';

class AnswerDto {
  @IsNotEmpty()
  questionId: number;

  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  answerText: string;
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @MaxLength(16)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Username может содержать только английские буквы, цифры, дефис (-) и нижнее подчёркивание (_)',
  })
  username: string;

  @MaxLength(64)
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
