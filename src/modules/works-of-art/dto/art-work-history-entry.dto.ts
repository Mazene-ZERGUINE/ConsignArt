import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { type ArtWorkStatus } from '../../../shared/enums/art-work-status.enum';

export class ArtWorkHistoryEntryDto {
  @ApiProperty({ description: 'Status the art work had before this change' })
  previousStatus: ArtWorkStatus;

  @ApiProperty({ description: 'Status the art work was changed to' })
  newStatus: ArtWorkStatus;

  @ApiProperty({ description: 'Whether this change was the result of a loan' })
  isLoaned: boolean;

  @ApiPropertyOptional({ description: 'Name of the gallery the art work moved from, if any' })
  fromGalleryName: string | null;

  @ApiPropertyOptional({ description: 'Name of the gallery the art work moved to, if any' })
  toGalleryName: string | null;

  @ApiProperty({ description: 'When this status change happened' })
  changedAt: Date;
}
