import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtWorkEntity } from '../../../works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../../../works-of-art/entities/art-work-transfer-history.entity';
import { GalleryEntity } from '../../../gallery/entities/gallery.entity';
import { WorkArtLoanEntity } from '../../../works-of-art/entities/work-art-load.entity';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { LoanResponseDto } from '../dto/loan-response.dto';
import { LoadedLoan, toLoanDto } from '../mappers/loan.mapper';
import { UserRoles } from '../../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../../core/types/authenticated-user.types';
import { type LoadedArtWork } from '../../../works-of-art/mappers/art-work.mapper';
import { BusinessRuleViolationException } from '../../../../core/exceptions/business-rule-violation.exception';

@Injectable()
export class CreateLoanService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async execute(requester: AuthenticatedUser, dto: CreateLoanDto): Promise<LoanResponseDto> {
    if (new Date(dto.to) < new Date(dto.from)) {
      throw new BadRequestException('The loan end date cannot be before its start date');
    }

    return this.dataSource.transaction(async (manager) => {
      const artWork = (await manager.findOne(ArtWorkEntity, {
        where: { id: dto.artWorkId },
        relations: { gallery: { user: true } },
      })) as LoadedArtWork | null;

      if (!artWork) throw new NotFoundException('Art work not found');
      this.assertCanLend(requester, artWork);

      if (artWork.status === ArtWorkStatusEnum.ON_LOAN) {
        throw new BusinessRuleViolationException(
          'This art work is already on loan',
          'ART_WORK_ALREADY_ON_LOAN',
        );
      }
      if (artWork.status !== ArtWorkStatusEnum.AVAILABLE) {
        throw new BusinessRuleViolationException(
          'Only available art works can be lent',
          'ART_WORK_NOT_AVAILABLE',
        );
      }

      const toGallery = await manager.findOne(GalleryEntity, { where: { id: dto.toGalleryId } });
      if (!toGallery) throw new NotFoundException('Destination gallery not found');
      if (toGallery.id === artWork.gallery.id) {
        throw new BusinessRuleViolationException(
          'Cannot lend an art work to its own gallery',
          'CANNOT_LEND_TO_OWN_GALLERY',
        );
      }

      const loan = manager.create(WorkArtLoanEntity, {
        workArt: artWork,
        fromGallery: artWork.gallery,
        toGallery,
        from: new Date(dto.from),
        to: new Date(dto.to),
        conditions: dto.conditions,
      });
      await manager.save(loan);

      const history = manager.create(ArtWorkTransferHistoryEntity, {
        artWork,
        currentStatus: artWork.status,
        newStatus: ArtWorkStatusEnum.ON_LOAN,
        isLoaned: true,
        fromGallery: artWork.gallery,
        toGallery,
      });
      await manager.save(history);

      await manager.update(ArtWorkEntity, artWork.id, { status: ArtWorkStatusEnum.ON_LOAN });

      const loaded: LoadedLoan = {
        ...loan,
        workArt: artWork,
        fromGallery: artWork.gallery,
        toGallery,
      };
      return toLoanDto(loaded);
    });
  }

  private assertCanLend(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException('Only the owning gallery or an admin can lend this art work');
  }
}
