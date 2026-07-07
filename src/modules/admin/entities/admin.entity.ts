/**
 * AdminEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique à un admin
 */

import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { AdminUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

@Entity('admin_entity')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => GalleryEntity, (entity) => entity.validatedByAdmin)
  validatedGalleries: GalleryEntity[];

  @OneToOne(() => UserEntity, (entity) => entity.admin)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  public toAdminDto(userEntity: UserEntity): AdminUserResponseDto {
    return {
      ...toBase(userEntity, this.id, UserRoles.ADMIN),
    };
  }
}
