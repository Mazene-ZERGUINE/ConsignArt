/**
 * UserEntity
 *
 * - Entité de base contient les données communes à tous les utilisateurs (email, mot de passe, rôle).
 * - Gere l'authentification
 * - Chaque type d'utilisateur (AdminEntity, GalleryEntity, ArtistEntity, CollectorEntity) est associé à une instance de UserEntity via une relation one-to-one
 */

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { type UserRole, UserRoles } from '../../../shared/enums/user-roles.enum';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { CollectorEntity } from '../../collector/collector.entity';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';

@Entity('users_entity')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('varchar', { name: 'email', length: 255, unique: true, nullable: false })
  email: string;

  @Column('varchar', { name: 'hashed_password', length: 255, nullable: false })
  hashedPassword: string;

  @Column('simple-enum', { enum: UserRoles, default: UserRoles.COLLECTOR, nullable: false })
  userRole: UserRole;

  @OneToOne(() => GalleryEntity, (entity) => entity.user)
  gallery?: GalleryEntity;

  @OneToOne(() => CollectorEntity, (entity) => entity.user)
  collector?: CollectorEntity;

  @OneToOne(() => AdminEntity, (entity) => entity.user)
  admin?: AdminEntity;

  @OneToOne(() => ArtistEntity, (entity) => entity.user)
  artist?: ArtistEntity;
}
