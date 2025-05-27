import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { UpdateModDto } from '../mods/dto/update-mod.dto';
import { CreateModDto } from '../mods/dto/create-mod.dto';

export class UpdateServerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  serverAddress?: string;

  @IsOptional()
  @IsString()
  minecraftVersion?: string;

  @IsOptional()
  @IsString()
  javaVersion?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModDto)
  mods?: CreateModDto[];
}
