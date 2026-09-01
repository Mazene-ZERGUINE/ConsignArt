import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../entities/art-work-transfer-history.entity';
import { ArtWorkHistoryEntryDto } from '../dto/art-work-history-entry.dto';
import { LoadedArtWork } from '../mappers/art-work.mapper';
import { toArtWorkHistoryDto } from '../mappers/art-work-history.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class GetArtWorkHistoryService {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
    @InjectRepository(ArtWorkTransferHistoryEntity)
    private readonly historyRepository: Repository<ArtWorkTransferHistoryEntity>,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    artWorkId: string,
  ): Promise<ArtWorkHistoryEntryDto[]> {
    const artWork = (await this.artWorkRepository.findOne({
      where: { id: artWorkId },
      relations: { owner: { user: true }, gallery: { user: true } },
    })) as LoadedArtWork | null;

    if (!artWork) throw new NotFoundException('Art work not found');
    this.assertCanView(requester, artWork);

    const history = await this.historyRepository.find({
      where: { artWork: { id: artWorkId } },
      relations: { fromGallery: true, toGallery: true },
      order: { createdAt: 'ASC' },
    });

    return history.map(toArtWorkHistoryDto);
  }

  private assertCanView(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    if (requester.role === UserRoles.ARTISTE && artWork.owner.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException('You are not allowed to view this art work history');
  }
}
