import { IsNotEmpty, IsString } from "class-validator";

export class EmailConfirmDto {
  @IsNotEmpty({ message: 'Токен не должен быть пустым.' })
  @IsString({ message: 'Токен должен быть строкой.' })
  token: string;
}