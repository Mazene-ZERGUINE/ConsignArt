import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { Repository } from 'typeorm';
import { ArtWorkResponseDto } from '../dto/art-work-response.dto';
import { LoadedArtWork, toArtWorkDto } from '../mappers/art-work.mapper';

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
}
