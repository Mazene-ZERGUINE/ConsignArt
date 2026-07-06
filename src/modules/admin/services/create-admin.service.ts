import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class CreateAdminService {
  async execute(manager: EntityManager, userEntity: UserEntity): Promise<void> {
    const repository = manager.getRepository(AdminEntity);
    const entity = repository.create({ user: userEntity });
    await repository.save(entity);
  }
}
