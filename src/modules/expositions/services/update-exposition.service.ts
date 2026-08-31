import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpositionEntity } from '../entities/exposition.entity';
import { UpdateExpositionDto } from '../dto/update-exposition.dto';
import { ExpositionResponseDto } from '../dto/exposition-response.dto';
import { LoadedExposition, toExpositionDto } from '../mappers/exposition.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class UpdateExpositionService {
  constructor(
    @InjectRepository(ExpositionEntity)
    private readonly expositionRepository: Repository<ExpositionEntity>,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    id: string,
    dto: UpdateExpositionDto,
  ): Promise<ExpositionResponseDto> {
    const exposition = (await this.expositionRepository.findOne({
      where: { id },
      relations: { gallery: { user: true }, artWorksList: true },
    })) as LoadedExposition | null;

    if (!exposition) throw new NotFoundException('Exposition not found');
    this.assertCanManage(requester, exposition);

    await this.expositionRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
      ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
      ...(dto.address !== undefined && { expositionAddress: dto.address }),
      ...(dto.zipCode !== undefined && { zipCode: dto.zipCode }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.virtualLink !== undefined && { virtualLink: dto.virtualLink }),
    });

    const updated = (await this.expositionRepository.findOne({
      where: { id },
      relations: { gallery: { user: true }, artWorksList: true },
    })) as LoadedExposition;

    return toExpositionDto(updated);
  }

  private assertCanManage(requester: AuthenticatedUser, exposition: LoadedExposition): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (
      requester.role === UserRoles.GALLERY &&
      exposition.gallery.user?.userId === requester.userId
    ) {
      return;
    }
    throw new ForbiddenException(
      'Only the organizing gallery or an admin can update this exposition',
    );
  }
}
