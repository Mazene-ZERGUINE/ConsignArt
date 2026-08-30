import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../../works-of-art/entities/art-work-transfer-history.entity';
import { ExpositionEntity } from '../entities/exposition.entity';
import { CreateExpositionDto } from '../dto/create-exposition.dto';
import { ExpositionResponseDto } from '../dto/exposition-response.dto';
import { LoadedExposition, toExpositionDto } from '../mappers/exposition.mapper';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class CreateExpositionService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    dto: CreateExpositionDto,
  ): Promise<ExpositionResponseDto> {
    const galleryUser = await this.getUser.execute({ id: requester.userId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new ForbiddenException('Only a gallery can organize an exposition');
    }
    const gallery = galleryUser.gallery;

    if (dto.artWorkIds.length === 0) {
      throw new BadRequestException('An exposition cannot be created with zero art works');
    }

    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('The exposition end date cannot be before its start date');
    }

    return this.dataSource.transaction(async (manager) => {
      const artWorks = await manager.find(ArtWorkEntity, {
        where: { id: In(dto.artWorkIds) },
        relations: { gallery: true },
      });

      if (artWorks.length !== dto.artWorkIds.length) {
        throw new NotFoundException('One or more art works could not be found');
      }

      for (const artWork of artWorks) {
        if (artWork.gallery?.id !== gallery.id) {
          throw new ForbiddenException(
            `Art work "${artWork.title}" does not belong to your gallery`,
          );
        }
        if (artWork.status !== ArtWorkStatusEnum.AVAILABLE) {
          throw new BadRequestException(
            `Art work "${artWork.title}" is not available and cannot join an exposition`,
          );
        }
      }

      const exposition = manager.create(ExpositionEntity, {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        expositionType: dto.expositionType,
        expositionAddress: dto.address,
        zipCode: dto.zipCode,
        city: dto.city,
        virtualLink: dto.virtualLink,
        gallery,
        artWorksList: artWorks,
      });
      await manager.save(exposition);

      for (const artWork of artWorks) {
        const history = manager.create(ArtWorkTransferHistoryEntity, {
          artWork,
          currentStatus: artWork.status,
          newStatus: ArtWorkStatusEnum.ON_LOAN,
          isLoaned: true,
          fromGallery: gallery,
          toGallery: gallery,
        });
        await manager.save(history);
        await manager.update(ArtWorkEntity, artWork.id, { status: ArtWorkStatusEnum.ON_LOAN });
        artWork.status = ArtWorkStatusEnum.ON_LOAN;
      }

      const loaded: LoadedExposition = { ...exposition, gallery, artWorksList: artWorks };
      return toExpositionDto(loaded);
    });
  }
}
