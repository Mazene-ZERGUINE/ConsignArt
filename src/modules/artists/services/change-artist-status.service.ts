import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../entities/artist.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ChangeArtistStatusDto } from '../dto/change-artist-status.dto';
import { ArtistUserResponseDto } from '../dto/artist-user-response.dto';
import { ArtistWithRelations, toArtistDto } from '../mappers/artist.mapper';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class ChangeArtistStatusService {
  constructor(
    @InjectRepository(ArtistEntity) private readonly artistRepository: Repository<ArtistEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    artistUserId: string,
    dto: ChangeArtistStatusDto,
  ): Promise<ArtistUserResponseDto> {
    const artist = await this.loadArtist(artistUserId);

    const isOwningGallery = requester.userId === artist.gallery?.user.userId;
    if (requester.role !== UserRoles.ADMIN && !isOwningGallery) {
      throw new ForbiddenException(
        'Only the owning gallery or an admin can change the artist status',
      );
    }

    artist.status = dto.status;
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
