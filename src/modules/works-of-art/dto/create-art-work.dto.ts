import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  public description: string;

  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @IsNotEmpty()
  public creationYear: string;

  @IsString()
  @IsNotEmpty()
  public technique: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  depth?: number;

  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;

  @IsNumber()
  @IsNotEmpty()
  reservationPrice: number;

  @IsUrl()
  @IsNotEmpty()
  public imageUrl: string;
}
