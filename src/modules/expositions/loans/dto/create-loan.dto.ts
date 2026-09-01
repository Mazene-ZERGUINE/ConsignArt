import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsAfterOrEqualDate } from '../../../../core/validators/property-comparison.validators';

export class CreateLoanDto {
  @IsUUID()
  @IsNotEmpty()
  artWorkId: string;

  @IsUUID()
  @IsNotEmpty()
  toGalleryId: string;

  @IsDateString()
  @IsNotEmpty()
  from: string;

  @IsDateString()
  @IsNotEmpty()
  @IsAfterOrEqualDate('from', { message: 'to must be on or after from' })
  to: string;

  @ApiPropertyOptional({ description: 'Conditions attached to the loan (insurance, transport…)' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  conditions?: string;
}
