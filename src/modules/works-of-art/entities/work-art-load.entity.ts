import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ArtWorkEntity } from './art-work.entity';

@Entity('work_art_loan_entity')
export class WorkArtLoanEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => ArtWorkEntity, { nullable: false })
  @JoinColumn({ name: 'art_work_id' })
  public workArt: ArtWorkEntity;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'from_gallery_id' })
  public fromGallery: GalleryEntity | null;

  @ManyToOne(() => GalleryEntity, { nullable: true })
  @JoinColumn({ name: 'to_gallery_id' })
  public toGallery: GalleryEntity | null;

  @Column('date')
  public from: Date;

  @Column('date')
  public to: Date;

  @Column('text', { name: 'conditions', nullable: true })
  public conditions?: string;
}
