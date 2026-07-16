import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtWorkResponseDto } from '../dto/art-work-response.dto';
import { LoadedArtWork, toArtWorkDto } from '../mappers/art-work.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatus, ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class GetArtWorkService {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
  ) {}

  public async getOne(artWorkId: string): Promise<ArtWorkResponseDto> {
    const artWork = (await this.artWorkRepository.findOne({
      where: { id: artWorkId },
      relations: { owner: { user: true }, gallery: { user: true }, expositions: { gallery: true } },
    })) as LoadedArtWork | null;

    if (!artWork) throw new NotFoundException('Art work not found');

    return toArtWorkDto(artWork);
  }

  public async list(
    requester: AuthenticatedUser,
    status?: ArtWorkStatus,
  ): Promise<ArtWorkResponseDto[]> {
    const artWorks = (await this.artWorkRepository.find({
      where: this.buildScope(requester, status),
      relations: { owner: { user: true }, gallery: { user: true }, expositions: { gallery: true } },
    })) as LoadedArtWork[];

    return artWorks.map(toArtWorkDto);
  }

  private buildScope(
    requester: AuthenticatedUser,
    status?: ArtWorkStatus,
  ): FindOptionsWhere<ArtWorkEntity> {
    const where: FindOptionsWhere<ArtWorkEntity> = {};
    if (status) where.status = status;

    switch (requester.role) {
      case UserRoles.GALLERY:
        where.gallery = { user: { userId: requester.userId } };
        break;
      case UserRoles.ARTISTE:
        where.owner = { user: { userId: requester.userId } };
        break;
      case UserRoles.COLLECTOR:
        where.status = ArtWorkStatusEnum.AVAILABLE;
        break;
    }

    return where;
  }
}
