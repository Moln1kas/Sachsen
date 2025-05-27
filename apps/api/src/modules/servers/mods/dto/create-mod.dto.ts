import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateModDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  downloadUrl: string;
}
