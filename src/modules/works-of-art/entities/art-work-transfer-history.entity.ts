import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { type ArtWorkStatus, ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ArtWorkEntity } from './art-work.entity';

@Entity('art_work_transfer_history_entity')
export class ArtWorkTransferHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => ArtWorkEntity, { nullable: false })
  @JoinColumn({ name: 'art_work_id' })
  artWork: ArtWorkEntity;

  @Column('simple-enum', { name: 'current_status', enum: ArtWorkStatusEnum })
  currentStatus: ArtWorkStatus;

  @Column('simple-enum', { name: 'new_status', enum: ArtWorkStatusEnum })
  newStatus: ArtWorkStatus;

  @Column('boolean', { name: 'is_loaned' })
  isLoaned: boolean;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'from_gallery_id' })
  fromGallery: GalleryEntity | null;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'to_gallery_id' })
  toGallery: GalleryEntity | null;

  @CreateDateColumn({ name: 'status_change_date' })
  createdAt: Date;
}
