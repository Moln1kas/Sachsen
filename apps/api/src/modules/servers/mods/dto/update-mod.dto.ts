import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateModDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  modrinthModId?: string;

  @IsOptional()
  @IsString()
  modrinthModVersionId?: string;
}
