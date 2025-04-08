import { IsNotEmpty, IsString } from "class-validator";

export class AddNewModDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}