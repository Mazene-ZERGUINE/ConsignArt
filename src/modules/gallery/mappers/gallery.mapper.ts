import { GalleryEntity } from '../entities/gallery.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { TransferRequestsResponseDto } from '../../../shared/dto/transfer-requests-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';
import { ArtistWithRelations, toArtistDto } from '../../artists/mappers/artist.mapper';
import { AdminWithRelations, toAdminDto } from '../../admin/mappers/admin.mapper';

export type GalleryWithUser = GalleryEntity & { user: UserEntity };

export type GalleryWithRelations = GalleryWithUser & {
  artists: ArtistWithRelations[];
  validatedByAdmin: AdminWithRelations | null;
};

export function toGalleryDto(gallery: GalleryWithRelations): GalleryUserResponseDto {
  return {
    ...toBase(gallery.user, gallery.id, UserRoles.GALLERY),
    galleryVerified: gallery.isValidated,
    validatedAt: gallery.validatedAt,
    validatedByAdmin: gallery.validatedByAdmin ? toAdminDto(gallery.validatedByAdmin) : null,
    associatedArtists: gallery.artists.map(toArtistDto),
  };
}

export function toGallerySummaryDto(
  gallery: GalleryWithUser,
): TransferRequestsResponseDto['toGallery'] {
  const { userId, entityId, email } = toBase(gallery.user, gallery.id, UserRoles.GALLERY);
  return { userId, entityId, email, galleryVerified: gallery.isValidated };
}
