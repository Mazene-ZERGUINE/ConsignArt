/**
 * ArtistEntity
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique aux artistes
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
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ArtistUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';
import {
  type ActivityStatus,
  ActivityStatusEnum,
} from '../../../shared/enums/activity-status.enum';
import { TransferRequestEntity } from '../../../shared/entities/transfer-request.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';

@Entity('artist_entity')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'first_name', length: 255, nullable: true, default: null })
  public firstName: string;

  @Column('varchar', { name: 'last_name', nullable: true, length: 255, default: null })
  public lastName: string;

  @Column('text', { name: 'bio', nullable: true, default: null })
  public bio: string;

  @Column('varchar', { name: 'portfolio_url', default: null, nullable: true })
  public portfolioUrl: string;

  @Column('varchar', { name: 'nationality', length: 60, nullable: true, default: null })
  public nationality: string;

  @Column('simple-enum', {
    name: 'status',
    enum: ActivityStatusEnum,
    default: ActivityStatusEnum.ACTIVE,
  })
  public status: ActivityStatus;

  @Column('date', { name: 'joined_gallery_at', default: null, nullable: true })
  public joinedGalleryAt: Date;

  @ManyToOne(() => GalleryEntity, (entity) => entity.artists)
  public gallery: GalleryEntity;

  @OneToOne(() => UserEntity, (entity) => entity.artist)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @OneToMany(() => TransferRequestEntity, (entity) => entity.artistToTransfer)
  transferRequests: TransferRequestEntity[];

  @OneToMany(() => ArtWorkEntity, (entity) => entity.owner)
  artWorks: ArtWorkEntity[];

  public toArtistDto(): ArtistUserResponseDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      biography: this.bio,
      nationality: this.nationality,
      gallery: this.gallery
        ? {
            entityId: this.gallery.id,
            galleryVerified: this.gallery.isValidated,
            userId: this.gallery.user.userId,
            email: this.gallery.user.email,
          }
        : null,
      joinedGalleryAt: this.joinedGalleryAt,
      portfolioUrl: this.portfolioUrl,
      ...toBase(this.user, this.id, UserRoles.ARTISTE),
    };
  }
}
