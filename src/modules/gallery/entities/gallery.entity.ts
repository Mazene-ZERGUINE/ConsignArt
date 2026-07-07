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
import { UserEntity } from '../../users/entities/user.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

@Entity('gallery_entity')
export class GalleryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { name: 'is_validated', default: false, nullable: false })
  isValidated: boolean;

  @Column('datetime', { name: 'validated_at', nullable: true })
  validatedAt: Date | null;

  @ManyToOne(() => AdminEntity, (entity) => entity.validatedGalleries, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  validatedByAdmin: AdminEntity;

  @OneToOne(() => UserEntity, (entity) => entity.gallery, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ArtistEntity, (entity) => entity.gallery)
  artists: ArtistEntity[];

  public toGalleryDto(userEntity: UserEntity): GalleryUserResponseDto {
    return {
      ...toBase(userEntity, this.id, UserRoles.GALLERY),
      galleryVerified: this.isValidated,
      validatedAt: this.validatedAt,
      validatedByAdmin: this.validatedByAdmin.toAdminDto(this.validatedByAdmin.user),
      associatedArtists: (this.artists ?? []).map((artist) => artist.toArtistDto(artist.user)),
    };
  }
}
