import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  modrinthModId: string;

  @IsString()
  @IsNotEmpty()
  modrinthModVersionId: string;
}
