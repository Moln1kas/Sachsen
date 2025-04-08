import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLauncherDto {
  @IsString()
  @IsNotEmpty()
  launcher_version: string;
}