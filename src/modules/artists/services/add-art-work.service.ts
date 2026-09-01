import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtWorkService } from '../../works-of-art/services/create-art-work.service';
import { CreateArtWorkDto } from '../../works-of-art/dto/create-art-work.dto';
import { GetArtworkByArtistService } from '../../works-of-art/services/get-art-work-by-artist.service';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { BusinessRuleViolationException } from '../../../core/exceptions/business-rule-violation.exception';

@Injectable()
export class AddArtworkService {
  private readonly MAX_ACTIVE_ART_WORKS_PER_ARTIST_IN_GALLERY = 50;

  constructor(
    private readonly createArtWorkService: CreateArtWorkService,
    private readonly getArtistsArtWorks: GetArtworkByArtistService,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(artistId: string, dto: CreateArtWorkDto): Promise<void> {
    const owner = await this.getUser.execute({ id: artistId });
    if (owner.userRole !== UserRoles.ARTISTE) {
      throw new NotFoundException('this artist does not exist');
    }
    if (!owner.artist.gallery) {
      throw new NotFoundException('This gallery account does not exist');
    }

    const activeWorksInGallery = await this.getArtistsArtWorks.countActiveInGallery(
      artistId,
      owner.artist.gallery.id,
    );
    if (activeWorksInGallery >= this.MAX_ACTIVE_ART_WORKS_PER_ARTIST_IN_GALLERY) {
      throw new BusinessRuleViolationException(
        'artist has reached the maximum number of active works in this gallery',
        'MAX_ACTIVE_ART_WORKS_PER_ARTIST_IN_GALLERY',
      );
    }

    await this.createArtWorkService.execute(artistId, dto);
  }
}
