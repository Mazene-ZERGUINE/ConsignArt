import { Expose } from 'class-transformer';
import type { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';

export class ArtistPassthrough {
  @Expose()
  firstName: string | null;

  @Expose()
  lastName: string | null;

  @Expose()
  nationality: string | null;

  @Expose()
  portfolioUrl: string | null;

  @Expose()
  joinedGalleryAt: Date | null;
}

export class ArtistUserResponseDto extends ArtistPassthrough {
  userId: string;
  entityId: string;
  userRole: typeof UserRoles.ARTISTE;
  email: string;
  biography: string | null;
  gallery: Pick<GalleryUserResponseDto, 'userId' | 'entityId' | 'galleryVerified' | 'email'> | null;
}
