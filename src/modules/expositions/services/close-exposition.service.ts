import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../../works-of-art/entities/art-work-transfer-history.entity';
import { ExpositionEntity } from '../entities/exposition.entity';
import { LoadedExposition } from '../mappers/exposition.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class CloseExpositionService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async execute(requester: AuthenticatedUser, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const exposition = (await manager.findOne(ExpositionEntity, {
        where: { id },
        relations: { gallery: { user: true }, artWorksList: true },
      })) as LoadedExposition | null;

      if (!exposition) throw new NotFoundException('Exposition not found');
      this.assertCanManage(requester, exposition);

      for (const artWork of exposition.artWorksList) {
        if (artWork.status !== ArtWorkStatusEnum.ON_LOAN) continue;

        const history = manager.create(ArtWorkTransferHistoryEntity, {
          artWork,
          currentStatus: artWork.status,
          newStatus: ArtWorkStatusEnum.AVAILABLE,
          isLoaned: false,
          fromGallery: exposition.gallery,
          toGallery: exposition.gallery,
        });
        await manager.save(history);
        await manager.update(ArtWorkEntity, artWork.id, { status: ArtWorkStatusEnum.AVAILABLE });
      }

      await manager.remove(exposition);
    });
  }

  private assertCanManage(requester: AuthenticatedUser, exposition: LoadedExposition): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (
      requester.role === UserRoles.GALLERY &&
      exposition.gallery.user?.userId === requester.userId
    ) {
      return;
    }
    throw new ForbiddenException('Only the organizing gallery or an admin can close this exposition');
  }
}
