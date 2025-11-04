import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { UpdateModDto } from '../mods/dto/update-mod.dto';
import { CreateModDto } from '../mods/dto/create-mod.dto';
import { IsDomain } from 'src/common/validators/is-domain.validator';

export class UpdateServerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDomain()
  serverAddress?: string;

  @IsOptional()
  @IsString()
  minecraftVersionHash?: string;

  @IsOptional()
  @IsString()
  minecraftVersion?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModDto)
  mods?: CreateModDto[];
}
