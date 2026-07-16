import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtWorkDto {
  @ApiPropertyOptional({ description: 'Title of the art work', maxLength: 60 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the art work' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ description: 'Technique used (oil, photography, sculpture, …)' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  technique?: string;

  @ApiPropertyOptional({ description: 'Height in centimeters' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: 'Width in centimeters' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ description: 'Depth in centimeters' })
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiPropertyOptional({ description: 'Selling price in euros' })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @ApiPropertyOptional({ description: 'Reserve price (floor price) in euros' })
  @IsOptional()
  @IsNumber()
  reservationPrice?: number;

  @ApiPropertyOptional({ description: 'Image URL of the art work' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
