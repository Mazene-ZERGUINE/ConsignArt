import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArtWorkService } from '../../works-of-art/services/create-art-work.service';
import { CreateArtWorkDto } from '../../works-of-art/dto/create-art-work.dto';
import { GetArtworkByArtistService } from '../../works-of-art/services/get-art-work-by-artist.service';

@Injectable()
export class AddArtworkService {
  private readonly MAX_ART_WORKS_PER_ARTIST = 50;

  constructor(
    private readonly createArtWorkService: CreateArtWorkService,
    private readonly getArtistsArtWorks: GetArtworkByArtistService,
  ) {}

  public async execute(artistId: string, dto: CreateArtWorkDto): Promise<void> {
    const activeWorks = await this.getArtistsArtWorks.execute(artistId);
    if (activeWorks.length >= this.MAX_ART_WORKS_PER_ARTIST) {
      throw new BadRequestException('artist has reached the maximum number of works');
    }

    await this.createArtWorkService.execute(artistId, dto);
  }
}
