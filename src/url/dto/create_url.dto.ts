import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  original_url: string;

  @IsString()
  @IsOptional()
  @MaxLength(16)
  custom_code: string;
}
