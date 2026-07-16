import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateArtistDto {
  @ApiPropertyOptional({ description: 'Artist first name', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Artist last name', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Short biography of the artist' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio?: string;

  @ApiPropertyOptional({ description: 'Link to the artist portfolio', example: 'https://…' })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @ApiPropertyOptional({ description: 'Artist nationality', maxLength: 60 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nationality?: string;
}
