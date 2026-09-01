import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../entities/artist.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtistUserResponseDto } from '../dto/artist-user-response.dto';
import { ArtistWithRelations, toArtistDto } from '../mappers/artist.mapper';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class GetArtistService {
  constructor(
    @InjectRepository(ArtistEntity) private readonly artistRepository: Repository<ArtistEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async getOne(
    requester: AuthenticatedUser,
    artistUserId: string,
  ): Promise<ArtistUserResponseDto> {
    const artist = await this.loadArtist(artistUserId);

    const isOwningGallery = requester.userId === artist.gallery?.user.userId;
    const isSelf = requester.userId === artistUserId;
    if (requester.role !== UserRoles.ADMIN && !isOwningGallery && !isSelf) {
      throw new ForbiddenException('You are not allowed to access this artist');
    }

    return toArtistDto(artist);
  }

  public async list(): Promise<ArtistUserResponseDto[]> {
    const artists = (await this.artistRepository.find({
      relations: { user: true, gallery: { user: true } },
    })) as ArtistWithRelations[];
    return artists.map(toArtistDto);
  }

  private async loadArtist(artistUserId: string): Promise<ArtistWithRelations> {
    const artistUser = await this.getUser.execute({ id: artistUserId });
    if (artistUser.userRole !== UserRoles.ARTISTE) {
      throw new NotFoundException('Artist not found');
    }
    return artistUser.artist;
  }
}
