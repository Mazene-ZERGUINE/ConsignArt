import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { GetUserService } from '../../users/services/get-user.service';
import { CreateUsersService } from '../../../shared/service/create-users.service';
import { SetArtistProfileService } from './set-artist-profile.service';
import { InvalidAccountException } from '../../../core/exceptions/invalid-account.exception';
import { UserRoles } from '../../../shared/enums/user-roles.enum';

@Injectable()
export class AddArtistToGalleryService {
  constructor(
    private readonly getUser: GetUserService,
    private readonly createUser: CreateUsersService,
    private readonly setArtistProfile: SetArtistProfileService,
  ) {}

  public async execute(galleryUserId: string, dto: CreateArtistDto): Promise<void> {
    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new InvalidAccountException('account is not a gallery user');
    }

    const artistUserAccount = await this.createUser.execute(dto.createUserDto);
    const newArtistEntity = await this.getUser.execute({ id: artistUserAccount.userId });
    if (newArtistEntity.userRole !== UserRoles.ARTISTE) {
      throw new InvalidAccountException('created account is not an artist user');
    }

    await this.setArtistProfile.execute(galleryUser.gallery, newArtistEntity.artist, dto);
  }
}
