import { TransferRequestEntity } from '../entities/transfer-request.entity';
import { TransferRequestsResponseDto } from '../dto/transfer-requests-response.dto';
import { ArtistWithUser, toArtistSummaryDto } from '../../modules/artists/mappers/artist.mapper';
import { GalleryWithUser, toGallerySummaryDto } from '../../modules/gallery/mappers/gallery.mapper';

export type TransferRequestWithRelations = TransferRequestEntity & {
  artistToTransfer: ArtistWithUser;
  fromGallery: GalleryWithUser;
  toGallery: GalleryWithUser;
};

export function toTransferRequestDto(
  transferRequest: TransferRequestWithRelations,
): TransferRequestsResponseDto {
  return {
    id: transferRequest.id,
    artistToTransfer: toArtistSummaryDto(transferRequest.artistToTransfer),
    fromGallery: toGallerySummaryDto(transferRequest.fromGallery),
    toGallery: toGallerySummaryDto(transferRequest.toGallery),
    transferReason: transferRequest.transferReason,
    status: transferRequest.status,
  };
}
