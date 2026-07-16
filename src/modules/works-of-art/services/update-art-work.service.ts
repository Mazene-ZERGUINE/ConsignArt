import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { UpdateArtWorkDto } from '../dto/update-art-work.dto';
import { ArtWorkResponseDto } from '../dto/art-work-response.dto';
import { LoadedArtWork, toArtWorkDto } from '../mappers/art-work.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

const ART_WORK_RELATIONS = {
  owner: { user: true },
  gallery: { user: true },
  expositions: { gallery: true },
} as const;

@Injectable()
export class UpdateArtWorkService {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    artWorkId: string,
    dto: UpdateArtWorkDto,
  ): Promise<ArtWorkResponseDto> {
    const artWork = (await this.artWorkRepository.findOne({
      where: { id: artWorkId },
      relations: ART_WORK_RELATIONS,
    })) as LoadedArtWork | null;

    if (!artWork) throw new NotFoundException('Art work not found');
    this.assertCanManage(requester, artWork);

    if (artWork.status === ArtWorkStatusEnum.SOLD) {
      throw new ConflictException('A sold art work can no longer be updated');
    }

    const nextSellingPrice = dto.sellingPrice ?? artWork.sellingPrice;
    const nextReservationPrice = dto.reservationPrice ?? artWork.reservationPrice;
    if (nextReservationPrice > nextSellingPrice) {
      throw new BadRequestException('Reserve price cannot be greater than the selling price');
    }

    await this.artWorkRepository.update(artWorkId, dto);

    const updated = (await this.artWorkRepository.findOne({
      where: { id: artWorkId },
      relations: ART_WORK_RELATIONS,
    })) as LoadedArtWork;

    return toArtWorkDto(updated);
  }

  private assertCanManage(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    if (requester.role === UserRoles.ARTISTE && artWork.owner.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException('You are not allowed to update this art work');
  }
}
