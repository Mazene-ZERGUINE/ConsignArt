/**
 * ArtistEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique aux artistes
 */

import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';

@Entity('artist_entity')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (entity) => entity.artist)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GalleryEntity, (entity) => entity.artists)
  gallery: GalleryEntity;
}
