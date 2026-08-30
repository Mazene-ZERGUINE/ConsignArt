import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoanDto {
  @IsUUID()
  @IsNotEmpty()
  artWorkId: string;

  @IsUUID()
  @IsNotEmpty()
  toGalleryId: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @ApiPropertyOptional({ description: 'Conditions attached to the loan (insurance, transport…)' })
  @IsOptional()
  @IsString()
  conditions?: string;
}
