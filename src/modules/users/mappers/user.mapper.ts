import { UserEntity } from '../entities/user.entity';
import { UserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { InvalidUserRoleException } from '../../auth/exceptions/invalid-user-role.exception';
import { AdminWithRelations, toAdminDto } from '../../admin/mappers/admin.mapper';
import { ArtistWithRelations, toArtistDto } from '../../artists/mappers/artist.mapper';
import { GalleryWithRelations, toGalleryDto } from '../../gallery/mappers/gallery.mapper';
import { CollectorWithRelations, toCollectorDto } from '../../collector/mappers/collector.mapper';

export type UserProfiles =
  | (UserEntity & { userRole: typeof UserRoles.ADMIN; admin: AdminWithRelations })
  | (UserEntity & { userRole: typeof UserRoles.ARTISTE; artist: ArtistWithRelations })
  | (UserEntity & { userRole: typeof UserRoles.GALLERY; gallery: GalleryWithRelations })
  | (UserEntity & { userRole: typeof UserRoles.COLLECTOR; collector: CollectorWithRelations });

export function toUserResponseDto(user: UserProfiles): UserResponseDto {
  switch (user.userRole) {
    case UserRoles.ADMIN:
      return toAdminDto(user.admin);

    case UserRoles.ARTISTE:
      return toArtistDto(user.artist);

    case UserRoles.GALLERY:
      return toGalleryDto(user.gallery);

    case UserRoles.COLLECTOR:
      return toCollectorDto(user.collector);

    default:
      throw new InvalidUserRoleException();
  }
}
