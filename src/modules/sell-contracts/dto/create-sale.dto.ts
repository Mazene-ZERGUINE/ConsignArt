import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDto {
  @IsUUID()
  @IsNotEmpty()
  artWorkId: string;

  @IsUUID()
  @IsNotEmpty()
  buyerId: string;

  @ApiPropertyOptional({
    description: 'Defaults to the art work listed selling price when omitted',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sellingPrice?: number;
}
