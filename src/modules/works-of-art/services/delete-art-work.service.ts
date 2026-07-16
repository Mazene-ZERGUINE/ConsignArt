import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../entities/art-work-transfer-history.entity';
import { LoadedArtWork } from '../mappers/art-work.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class DeleteArtWorkService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async execute(requester: AuthenticatedUser, artWorkId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const artWork = (await manager.findOne(ArtWorkEntity, {
        where: { id: artWorkId },
        relations: { owner: { user: true }, gallery: { user: true }, expositions: true },
      })) as LoadedArtWork | null;

      if (!artWork) throw new NotFoundException('Art work not found');
      this.assertCanManage(requester, artWork);

      if (artWork.status === ArtWorkStatusEnum.SOLD) {
        throw new ConflictException('A sold art work cannot be deleted (kept for sales history)');
      }
      if (artWork.status === ArtWorkStatusEnum.ON_LOAN || artWork.expositions.length > 0) {
        throw new ConflictException(
          'An art work on loan or part of an exposition cannot be deleted',
        );
      }

      await manager.delete(ArtWorkTransferHistoryEntity, { artWork: { id: artWorkId } });
      await manager.remove(artWork);
    });
  }

  private assertCanManage(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    if (requester.role === UserRoles.ARTISTE && artWork.owner.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException('You are not allowed to delete this art work');
  }
}
