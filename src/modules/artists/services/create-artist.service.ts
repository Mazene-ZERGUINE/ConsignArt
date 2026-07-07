import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ArtistEntity } from '../entities/artist.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class CreateArtistService {
  async execute(manager: EntityManager, userEntity: UserEntity): Promise<void> {
    const repository = manager.getRepository(ArtistEntity);
    const entity = repository.create({ user: userEntity });
    await repository.save(entity);
  }
}
