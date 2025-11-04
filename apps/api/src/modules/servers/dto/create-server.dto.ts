import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsUrl, IsInt } from 'class-validator';
import { IsDomain } from 'src/common/validators/is-domain.validator';
import { CreateModDto } from '../mods/dto/create-mod.dto';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDomain()
  serverAddress: string;

  @IsString()
  @IsNotEmpty()
  minecraftVersionHash: string;

  @IsString()
  @IsNotEmpty()
  minecraftVersion: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModDto)
  mods?: CreateModDto[];
}