/**
 * GalleryEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique à une galerie
 */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { AdminEntity } from '../../admin/entities/admin.entity';

@Entity('gallery_entity')
export class GalleryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { name: 'is_validated', default: false, nullable: false })
  isValidated: boolean;

  @Column('datetime', { name: 'validated_at', nullable: true })
  validatedAt: Date | null;

  @ManyToOne(() => AdminEntity, (entity) => entity.validatedGalleries, { nullable: true })
  validatedByAdmin: AdminEntity;

  @OneToOne(() => UserEntity, (entity) => entity.gallery, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ArtistEntity, (entity) => entity.gallery)
  artists: ArtistEntity[];
}
