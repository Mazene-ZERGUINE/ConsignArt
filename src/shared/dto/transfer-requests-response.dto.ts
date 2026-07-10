import { TransferRequestStatus } from '../enums/transfer-request.status.enum';
import { ArtistUserResponseDto, GalleryUserResponseDto } from './base-user-response.dto';

export type TransferRequestsResponseDto = {
  id: string;
  transferReason: string;
  status: TransferRequestStatus;
  artistToTransfer: Pick<
    ArtistUserResponseDto,
    'userId' | 'entityId' | 'email' | 'nationality' | 'firstName' | 'lastName'
  >;
  fromGallery: Pick<GalleryUserResponseDto, 'galleryVerified' | 'userId' | 'entityId' | 'email'>;
  toGallery: Pick<GalleryUserResponseDto, 'galleryVerified' | 'userId' | 'entityId' | 'email'>;
};
