import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  type ExpositionType,
  ExpositionTypeEnum,
} from '../../../shared/enums/exposition-type.enum';

export class CreateExpositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(ExpositionTypeEnum)
  expositionType: ExpositionType;

  @ApiPropertyOptional({ description: 'Required for on_site expositions' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ maxLength: 5 })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Required for virtual expositions' })
  @IsOptional()
  @IsUrl()
  virtualLink?: string;

  @ApiPropertyOptional({ description: 'Art works featured in the exposition, cannot be empty' })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  artWorkIds: string[];
}
