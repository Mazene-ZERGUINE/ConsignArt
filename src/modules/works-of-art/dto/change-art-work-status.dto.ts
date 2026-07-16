import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { type ArtWorkStatus, ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';

export class ChangeArtWorkStatusDto {
  @ApiProperty({ description: 'New status of the art work', enum: ArtWorkStatusEnum })
  @IsEnum(ArtWorkStatusEnum)
  @IsNotEmpty()
  status: ArtWorkStatus;
}
