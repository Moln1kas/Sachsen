import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateModDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  downloadUrl?: string;
}
