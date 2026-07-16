import { plainToInstance } from 'class-transformer';
import { ArtistEntity } from '../entities/artist.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ArtistPassthrough, ArtistUserResponseDto } from '../dto/artist-user-response.dto';
import { TransferRequestsResponseDto } from '../../../shared/dto/transfer-requests-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

export type ArtistWithUser = ArtistEntity & { user: UserEntity };

export type ArtistWithRelations = ArtistWithUser & {
  gallery: (GalleryEntity & { user: UserEntity }) | null;
};

export function toArtistDto(artist: ArtistWithRelations): ArtistUserResponseDto {
  return Object.assign(
    plainToInstance(ArtistPassthrough, artist, { excludeExtraneousValues: true }),
    {
      ...toBase(artist.user, artist.id, UserRoles.ARTISTE),
      biography: artist.bio,
      gallery: artist.gallery
        ? {
            entityId: artist.gallery.id,
            galleryVerified: artist.gallery.isValidated,
            userId: artist.gallery.user.userId,
            email: artist.gallery.user.email,
          }
        : null,
    },
  );
}

export function toArtistSummaryDto(
  artist: ArtistWithUser,
): TransferRequestsResponseDto['artistToTransfer'] {
  const { userId, entityId, email } = toBase(artist.user, artist.id, UserRoles.ARTISTE);
  return {
    userId,
    entityId,
    email,
    firstName: artist.firstName,
    lastName: artist.lastName,
    nationality: artist.nationality,
  };
}
