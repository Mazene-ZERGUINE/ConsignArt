/**
 * GalleryEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique à une galerie
 */

import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('gallery_entity')
export class GalleryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { name: 'is_validated', default: false, nullable: false })
  isValidated: boolean;

  @OneToOne(() => UserEntity, (entity) => entity.gallery, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
