import { IsString, IsNotEmpty, IsEmail, IsStrongPassword, ValidateNested, IsArray, ArrayMinSize, MaxLength, MinLength, Matches } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MaxLength(16)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Ваш никнейм может содержать только английские буквы, цифры, дефис (-) и нижнее подчёркивание (_).',
  })
  username: string;

  @MaxLength(64)
  @IsStrongPassword({
    minLength: 12,
  }, {
    message: 'Ваш пароль недостаточно надежен. Он должен включать в себя не менее 12 символов, содержать заглавные и строчные буквы, цифры и специальные символы.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Пожалуйста, расскажите нам немного о вашей будущей игре.',
  })
  @MinLength(20, {
    message: 'Опишите вашу будущую игру более подробно (минимум 20 символов).',
  })
  @MaxLength(5000)
  applicationText: string;
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
