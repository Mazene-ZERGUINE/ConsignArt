import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { GalleryEntity } from '../entities/gallery.entity';

@Injectable()
export class CreateGalleryService {
  async execute(manager: EntityManager, userEntity: UserEntity): Promise<void> {
    const repository = manager.getRepository(GalleryEntity);
    const entity = repository.create({ user: userEntity });
    await repository.save(entity);
  }
}
