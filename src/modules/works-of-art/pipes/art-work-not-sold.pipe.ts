import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';

/**
 * Business validation pipe: rejects the request at the HTTP boundary, before the
 * route handler runs, when the referenced art work has already been sold.
 */
@Injectable()
export class ArtWorkNotSoldPipe implements PipeTransform<string, Promise<string>> {
  constructor(
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
  ) {}

  async transform(artWorkId: string): Promise<string> {
    const artWork = await this.artWorkRepository.findOne({ where: { id: artWorkId } });

    if (artWork?.status === ArtWorkStatusEnum.SOLD) {
      throw new ConflictException('This art work has already been sold');
    }

    return artWorkId;
  }
}
