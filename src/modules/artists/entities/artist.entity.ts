/**
 * ArtistEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique aux artistes
 */

import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ArtistUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

@Entity('artist_entity')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (entity) => entity.artist)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GalleryEntity, (entity) => entity.artists)
  gallery: GalleryEntity;

  public toArtistDto(userEntity: UserEntity): ArtistUserResponseDto {
    return {
      ...toBase(userEntity, this.id, UserRoles.ARTISTE),
    };
  }
}
