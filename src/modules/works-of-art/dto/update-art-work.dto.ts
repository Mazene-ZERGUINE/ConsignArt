import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsLessThanOrEqualProperty } from '../../../core/validators/property-comparison.validators';

export class UpdateArtWorkDto {
  @ApiPropertyOptional({ description: 'Title of the art work', maxLength: 60 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the art work', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Technique used (oil, photography, sculpture, …)',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  technique?: string;

  @ApiPropertyOptional({ description: 'Height in centimeters' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  height?: number;

  @ApiPropertyOptional({ description: 'Width in centimeters' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  width?: number;

  @ApiPropertyOptional({ description: 'Depth in centimeters' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  depth?: number;

  @ApiPropertyOptional({ description: 'Selling price in euros' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(9999999999.99)
  sellingPrice?: number;

  @ApiPropertyOptional({ description: 'Reserve price (floor price) in euros' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(9999999999.99)
  @IsLessThanOrEqualProperty('sellingPrice', {
    message: 'reservationPrice must be less than or equal to sellingPrice',
  })
  reservationPrice?: number;

  @ApiPropertyOptional({ description: 'Image URL of the art work' })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  imageUrl?: string;
}
