import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CollectorEntity } from '../collector.entity';

@Injectable()
export class CreateCollectorService {
  async execute(manager: EntityManager, userEntity: UserEntity): Promise<void> {
    const repository = manager.getRepository(CollectorEntity);
    const entity = repository.create({ user: userEntity });
    await repository.save(entity);
  }
}
