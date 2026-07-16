import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../entities/artist.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { ArtistUserResponseDto } from '../dto/artist-user-response.dto';
import { ArtistWithRelations, toArtistDto } from '../mappers/artist.mapper';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class UpdateArtistService {
  constructor(
    @InjectRepository(ArtistEntity) private readonly artistRepository: Repository<ArtistEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    artistUserId: string,
    dto: UpdateArtistDto,
  ): Promise<ArtistUserResponseDto> {
    const artist = await this.loadArtist(artistUserId);

    const isOwningGallery = requester.userId === artist.gallery?.user.userId;
    const isSelf = requester.userId === artistUserId;
    if (requester.role !== UserRoles.ADMIN && !isOwningGallery && !isSelf) {
      throw new ForbiddenException('You are not allowed to update this artist');
    }

    Object.assign(artist, dto);
    await this.artistRepository.save(artist);

    return toArtistDto(artist);
  }

  private async loadArtist(artistUserId: string): Promise<ArtistWithRelations> {
    const artistUser = await this.getUser.execute({ id: artistUserId });
    if (artistUser.userRole !== UserRoles.ARTISTE) {
      throw new NotFoundException('Artist not found');
    }
    return artistUser.artist;
  }
}
