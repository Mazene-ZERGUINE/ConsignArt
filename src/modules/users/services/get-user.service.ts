import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { InvalidCredentialsException } from '../../auth/exceptions/invalid-credentials.exception';
import { UserRole, UserRoles } from '../../../shared/enums/user-roles.enum';
import { UserProfiles } from '../mappers/user.mapper';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(searchOptions: { email?: string; id?: string }): Promise<UserProfiles> {
    const { email, id } = searchOptions;

    const where = email ? { email } : id ? { userId: id } : null;
    if (!where) throw new InvalidCredentialsException();

    const base = await this.userRepository.findOne({
      where,
      select: { userId: true, userRole: true },
    });
    if (!base) {
      Logger.debug(`User with ${email ? 'email' : 'id'} ${email ?? id} not found`);
      throw new InvalidCredentialsException();
    }
    const user = await this.userRepository.findOne({
      where: { userId: base.userId },
      relations: this.relationsForRole(base.userRole),
    });
    if (!user) {
      Logger.debug(`User with id ${base.userId} and role ${base.userRole} not found`);
      throw new InvalidCredentialsException();
    }

    // Seule assertion UserProfiles du projet : TypeORM ne peut pas exprimer dans son type de
    // retour les relations demandées. Elle est valable tant que relationsForRole() ci-dessous
    // charge, pour chaque rôle, les relations exigées par UserProfiles — les deux se modifient ensemble.
    return user as UserProfiles;
  }

  private relationsForRole(role: UserRole): FindOptionsRelations<UserEntity> {
    switch (role) {
      case UserRoles.ADMIN:
        return { admin: { user: true } };
      case UserRoles.ARTISTE:
        return { artist: { user: true, gallery: { user: true } } };
      case UserRoles.COLLECTOR:
        return { collector: { user: true } };
      case UserRoles.GALLERY:
        return {
          gallery: {
            user: true,
            validatedByAdmin: { user: true },
            artists: { user: true, gallery: { user: true } },
          },
        };
    }
  }
}
