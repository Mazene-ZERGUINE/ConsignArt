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
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ExpositionEntity } from '../../expositions/entities/exposition.entity';
import { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

@Entity('gallery_entity')
export class GalleryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', { name: 'is_validated', default: false, nullable: false })
  isValidated: boolean;

  @Column('date', { name: 'validated_at', nullable: true })
  validatedAt: Date | null;

  @ManyToOne(() => AdminEntity, (entity) => entity.validatedGalleries, { nullable: true })
  @JoinColumn({ name: 'validated_by_admin_id' })
  validatedByAdmin: AdminEntity | null;

  @OneToOne(() => UserEntity, (entity) => entity.gallery, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ArtistEntity, (entity) => entity.gallery)
  artists: ArtistEntity[];

  @OneToMany(() => ArtWorkEntity, (entity) => entity.gallery)
  artWorks: ArtWorkEntity[];

  @OneToMany(() => ExpositionEntity, (entity) => entity.gallery)
  expositions: ExpositionEntity[];

  public toGalleryDto(): GalleryUserResponseDto {
    return {
      ...toBase(this.user, this.id, UserRoles.GALLERY),
      galleryVerified: this.isValidated,
      validatedAt: this.validatedAt,
      validatedByAdmin: this.validatedByAdmin ? this.validatedByAdmin.toAdminDto() : null,
      associatedArtists: (this.artists ?? []).map((artist) => artist.toArtistDto()),
    };
  }
}
