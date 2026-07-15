import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GalleryEntity } from '../entities/gallery.entity';

@Injectable()
export class CreateGalleryService {
  async execute(manager: EntityManager, userEntity: UserEntity, name: string): Promise<void> {
    const repository = manager.getRepository(GalleryEntity);
    const entity = repository.create({ user: userEntity, name });
    await repository.save(entity);
  }
}
