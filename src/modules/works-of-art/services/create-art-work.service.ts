import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { Repository } from 'typeorm';
import { CreateArtWorkDto } from '../dto/create-art-work.dto';
import { GetUserService } from '../../users/services/get-user.service';
import { ArtistWithRelations } from '../../artists/mappers/artist.mapper';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { UserRoles } from '../../../shared/enums/user-roles.enum';

@Injectable()
export class CreateArtWorkService {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(artistUserId: string, dto: CreateArtWorkDto): Promise<void> {
    const owner = await this.validateOwner(artistUserId);
    const gallery = this.validateGallery(owner);

    const artWorkEntity = this.artWorkRepository.create({
      ...dto,
      owner,
      gallery,
      submitDate: new Date(),
    });

    await this.artWorkRepository.save(artWorkEntity);
  }

  private validateGallery(artist: ArtistWithRelations): GalleryEntity {
    if (!artist.gallery) throw new NotFoundException('This gallery account does not exist');

    if (!artist.gallery.isValidated)
      throw new UnauthorizedException('This gallery account is not validated yet');

    return artist.gallery;
  }

  private async validateOwner(artistUserId: string): Promise<ArtistWithRelations> {
    const owner = await this.getUser.execute({ id: artistUserId });
    if (owner.userRole !== UserRoles.ARTISTE) {
      throw new NotFoundException('this artist does not exist');
    }
    return owner.artist;
  }
}
