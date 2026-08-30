import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ExpositionEntity } from '../entities/exposition.entity';
import { ExpositionResponseDto } from '../dto/exposition-response.dto';
import { LoadedExposition, toExpositionDto } from '../mappers/exposition.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

const EXPOSITION_RELATIONS = { gallery: { user: true }, artWorksList: true } as const;

@Injectable()
export class GetExpositionService {
  constructor(
    @InjectRepository(ExpositionEntity)
    private readonly expositionRepository: Repository<ExpositionEntity>,
  ) {}

  public async list(requester: AuthenticatedUser): Promise<ExpositionResponseDto[]> {
    const expositions = (await this.expositionRepository.find({
      where: this.buildScope(requester),
      relations: EXPOSITION_RELATIONS,
    })) as LoadedExposition[];

    return expositions.map(toExpositionDto);
  }

  public async getOne(id: string): Promise<ExpositionResponseDto> {
    const exposition = (await this.expositionRepository.findOne({
      where: { id },
      relations: EXPOSITION_RELATIONS,
    })) as LoadedExposition | null;

    if (!exposition) throw new NotFoundException('Exposition not found');

    return toExpositionDto(exposition);
  }

  private buildScope(requester: AuthenticatedUser): FindOptionsWhere<ExpositionEntity> {
    if (requester.role === UserRoles.GALLERY) {
      return { gallery: { user: { userId: requester.userId } } };
    }
    return {};
  }
}
