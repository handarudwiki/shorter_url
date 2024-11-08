import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://www.google.com',
  })
  @IsString()
  @IsNotEmpty()
  original_url: string;

  @ApiProperty({
    example: 'custom_code',
  })
  @IsString()
  @IsOptional()
  @MaxLength(16)
  custom_code?: string;
}
