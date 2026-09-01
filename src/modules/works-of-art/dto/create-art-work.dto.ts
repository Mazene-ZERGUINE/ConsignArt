import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsLessThanOrEqualProperty } from '../../../core/validators/property-comparison.validators';

export class CreateArtWorkDto {
  @ApiProperty({
    description: 'Title of the art work example: "The Great Wave off Kanagawa"',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  public title: string;

  @ApiProperty({
    description: 'Description of the art work',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public description: string;

  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @IsNotEmpty()
  @Matches(/^[0-9]{4}$/, { message: 'creationYear must be a 4-digit year' })
  public creationYear: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public technique: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  width?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  height?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  depth?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(9999999999.99)
  sellingPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(9999999999.99)
  @IsLessThanOrEqualProperty('sellingPrice', {
    message: 'reservationPrice must be less than or equal to sellingPrice',
  })
  reservationPrice: number;

  @IsUrl()
  @IsNotEmpty()
  @MaxLength(2048)
  public imageUrl: string;
}
