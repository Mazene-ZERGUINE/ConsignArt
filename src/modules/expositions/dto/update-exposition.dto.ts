import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { IsAfterOrEqualDate } from '../../../core/validators/property-comparison.validators';

export class UpdateExpositionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @IsAfterOrEqualDate('startDate', { message: 'endDate must be on or after startDate' })
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ maxLength: 5 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  virtualLink?: string;
}
