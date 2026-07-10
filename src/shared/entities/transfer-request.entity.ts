import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from '../../modules/artists/entities/artist.entity';
import { GalleryEntity } from '../../modules/gallery/entities/gallery.entity';

@Entity('transfer_request_entity')
export class TransferRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'transfer_reason', nullable: false })
  transferReason: string;

  @ManyToOne(() => ArtistEntity, (entity) => entity.transferRequests)
  @JoinColumn({ name: 'artist_to_transfer_id' })
  artistToTransfer: ArtistEntity;

  @ManyToOne(() => ArtistEntity, { nullable: true })
  @JoinColumn({ name: 'initiated_by_artist_id' })
  initiatedByArtist: ArtistEntity | null;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'initiated_by_gallery_id' })
  initiatedByGallery: GalleryEntity | null;
}
