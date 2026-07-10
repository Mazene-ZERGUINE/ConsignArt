import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from '../../modules/artists/entities/artist.entity';
import { GalleryEntity } from '../../modules/gallery/entities/gallery.entity';
import {
  type TransferRequestStatus,
  TransferRequestStatusEnum,
} from '../enums/transfer-request.status.enum';

@Entity('transfer_request_entity')
export class TransferRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'transfer_reason', nullable: false })
  transferReason: string;

  @Column('simple-enum', {
    name: 'request_status',
    enum: TransferRequestStatusEnum,
    default: TransferRequestStatusEnum.PENDING,
  })
  status: TransferRequestStatus;

  @ManyToOne(() => ArtistEntity, (entity) => entity.transferRequests)
  @JoinColumn({ name: 'artist_to_transfer_id' })
  artistToTransfer: ArtistEntity;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'from_gallery_id' })
  fromGallery: GalleryEntity | null;

  @ManyToOne(() => GalleryEntity, { nullable: false })
  @JoinColumn({ name: 'to_gallery_id' })
  toGallery: GalleryEntity;

  @ManyToOne(() => ArtistEntity, { nullable: true })
  @JoinColumn({ name: 'initiated_by_artist_id' })
  initiatedByArtist: ArtistEntity | null;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'initiated_by_gallery_id' })
  initiatedByGallery: GalleryEntity | null;
}
