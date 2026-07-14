import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { GetUserService } from '../../users/services/get-user.service';
import { CreateUsersService } from '../../../shared/service/create-users.service';
import { SetArtistProfileService } from './set-artist-profile.service';

@Injectable()
export class AddArtistToGalleryService {
  constructor(
    private readonly getUser: GetUserService,
    private readonly createUser: CreateUsersService,
    private readonly setArtistProfile: SetArtistProfileService,
  ) {}

  public async execute(galleryUserId: string, dto: CreateArtistDto): Promise<void> {
    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    const artistUserAccount = await this.createUser.execute(dto.createUserDto);
    const newArtistEntity = await this.getUser.execute({ id: artistUserAccount.userId });

    await this.setArtistProfile.execute(galleryUser.gallery, newArtistEntity.artist, dto);
  }
}
