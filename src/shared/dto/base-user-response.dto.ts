import { type UserRole, UserRoles } from '../enums/user-roles.enum';
import type { ArtistUserResponseDto } from '../../modules/artists/dto/artist-user-response.dto';

export type { ArtistUserResponseDto };

export type UserResponseDto =
  | AdminUserResponseDto
  | ArtistUserResponseDto
  | GalleryUserResponseDto
  | CollectorUserResponseDto;

export type BaseUserResponseDto<R extends UserRole = UserRole> = {
  userId: string;
  entityId: string;
  userRole: R;
  email: string;
};

export type AdminUserResponseDto = BaseUserResponseDto<typeof UserRoles.ADMIN> & {
  // todo: add other admin properties here
};

export type GalleryUserResponseDto = BaseUserResponseDto<typeof UserRoles.GALLERY> & {
  galleryVerified: boolean;
  validatedAt: Date | null;
  validatedByAdmin: AdminUserResponseDto | null;
  associatedArtists: ArtistUserResponseDto[];
};

export type CollectorUserResponseDto = BaseUserResponseDto<typeof UserRoles.COLLECTOR> & {
  // todo: add other collector properties here
};
