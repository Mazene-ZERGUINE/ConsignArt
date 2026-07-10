import { Injectable } from '@nestjs/common';
import { GalleryEntity } from '../entities/gallery.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { ActivityStatusEnum } from '../../../shared/enums/activity-status.enum';
@Injectable()
export class SetArtistProfileService {
  constructor(
    @InjectRepository(ArtistEntity) private readonly galleryRepository: Repository<ArtistEntity>,
  ) {}

  public async execute(
    galleryEntity: GalleryEntity,
    artistUserAccount: ArtistEntity,
    artistProfileDto: Omit<CreateArtistDto, 'createUserDto'>,
  ): Promise<void> {
    const updatedArtistEntity = {
      ...artistUserAccount,
      ...artistProfileDto,
      gallery: galleryEntity,
      joinedGalleryAt: new Date(),
      status: ActivityStatusEnum.ACTIVE,
    };

    await this.galleryRepository.save(updatedArtistEntity);
  }
}
