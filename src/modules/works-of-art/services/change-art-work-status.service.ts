import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../entities/art-work-transfer-history.entity';
import { ChangeArtWorkStatusDto } from '../dto/change-art-work-status.dto';
import { ArtWorkResponseDto } from '../dto/art-work-response.dto';
import { LoadedArtWork, toArtWorkDto } from '../mappers/art-work.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class ChangeArtWorkStatusService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async execute(
    requester: AuthenticatedUser,
    artWorkId: string,
    dto: ChangeArtWorkStatusDto,
  ): Promise<ArtWorkResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const artWork = (await manager.findOne(ArtWorkEntity, {
        where: { id: artWorkId },
        relations: {
          owner: { user: true },
          gallery: { user: true },
          expositions: { gallery: true },
        },
      })) as LoadedArtWork | null;

      if (!artWork) throw new NotFoundException('Art work not found');
      this.assertCanManage(requester, artWork);

      const currentStatus = artWork.status;
      const newStatus = dto.status;

      if (currentStatus === newStatus) {
        throw new BadRequestException('The art work already has this status');
      }
      if (currentStatus === ArtWorkStatusEnum.ON_LOAN && newStatus === ArtWorkStatusEnum.SOLD) {
        throw new BadRequestException('An art work on loan cannot be sold');
      }

      const history = manager.create(ArtWorkTransferHistoryEntity, {
        artWork,
        currentStatus,
        newStatus,
        isLoaned: newStatus === ArtWorkStatusEnum.ON_LOAN,
        fromGallery: artWork.gallery,
        toGallery: artWork.gallery,
      });
      await manager.save(history);

      await manager.update(ArtWorkEntity, artWorkId, { status: newStatus });

      const updated = (await manager.findOne(ArtWorkEntity, {
        where: { id: artWorkId },
        relations: {
          owner: { user: true },
          gallery: { user: true },
          expositions: { gallery: true },
        },
      })) as LoadedArtWork;

      return toArtWorkDto(updated);
    });
  }

  private assertCanManage(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException(
      'Only the owning gallery or an admin can change the art work status',
    );
  }
}
