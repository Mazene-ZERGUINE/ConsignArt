import { ArtWorkTransferHistoryEntity } from '../entities/art-work-transfer-history.entity';
import { ArtWorkHistoryEntryDto } from '../dto/art-work-history-entry.dto';

export function toArtWorkHistoryDto(entry: ArtWorkTransferHistoryEntity): ArtWorkHistoryEntryDto {
  return {
    previousStatus: entry.currentStatus,
    newStatus: entry.newStatus,
    isLoaned: entry.isLoaned,
    fromGalleryName: entry.fromGallery?.name ?? null,
    toGalleryName: entry.toGallery?.name ?? null,
    changedAt: entry.createdAt,
  };
}
