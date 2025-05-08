import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class SignInResponseDto {
  refresh_token: string;
  access_token: string;
  message: string;
}