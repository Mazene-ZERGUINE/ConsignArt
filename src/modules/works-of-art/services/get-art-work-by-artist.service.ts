import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { In, Repository } from 'typeorm';
import { ArtWorkResponseDto } from '../dto/art-work-response.dto';
import { LoadedArtWork, toArtWorkDto } from '../mappers/art-work.mapper';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';

const ACTIVE_STATUSES = [ArtWorkStatusEnum.AVAILABLE, ArtWorkStatusEnum.ON_LOAN];

@Injectable()
export class GetArtworkByArtistService {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
  ) {}

  public async execute(artistId: string): Promise<ArtWorkResponseDto[]> {
    const artWorks = (await this.artWorkRepository.find({
      where: { owner: { user: { userId: artistId } } },
      relations: { owner: true, gallery: true, expositions: { gallery: true } },
    })) as LoadedArtWork[];

    return artWorks.map(toArtWorkDto);
  }

  /** Count of the artist's art works that are currently available or on loan within the given gallery. */
  public async countActiveInGallery(artistId: string, galleryId: string): Promise<number> {
    return this.artWorkRepository.count({
      where: {
        owner: { user: { userId: artistId } },
        gallery: { id: galleryId },
        status: In(ACTIVE_STATUSES),
      },
    });
  }
}
