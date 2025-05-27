import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInResponseDto {
  refresh_token: string;
  access_token: string;
  message: string;
}