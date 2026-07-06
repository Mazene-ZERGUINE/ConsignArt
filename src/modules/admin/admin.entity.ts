/**
 * AdminEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique à un admin
 */

import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('admin_entity')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (entity) => entity.admin)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
