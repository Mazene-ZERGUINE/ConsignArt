import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { type ArtWorkStatus, ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { ExpositionEntity } from '../../expositions/entities/exposition.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';

@Entity('work_art_entity')
export class ArtWorkEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'title', nullable: false, length: 60 })
  public title: string;

  @Column('varchar', { nullable: false, length: 255 })
  public description: string;

  @Column('varchar', { name: 'creation_year', length: 4, nullable: false })
  public creationYear: string;

  @Column('varchar', { name: 'technique' })
  public technique: string;

  @Column('decimal', { precision: 10, scale: 2 })
  public height: number;

  @Column('decimal', { name: 'width', precision: 10, scale: 2 })
  public width: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  public depth?: number;

  @Column('decimal', { name: 'selling_price', precision: 12, scale: 2 })
  sellingPrice: number;

  @Column('decimal', { name: 'reservation_price', precision: 12, scale: 2 })
  reservationPrice: number;

  @Index()
  @Column('simple-enum', { enum: ArtWorkStatusEnum, default: ArtWorkStatusEnum.AVAILABLE })
  status: ArtWorkStatus;

  @Column('varchar')
  imageUrl: string;

  @Column('date', { name: 'submit_date' })
  submitDate: Date;

  @ManyToOne(() => ArtistEntity, (entity) => entity.artWorks)
  public owner: ArtistEntity;

  @ManyToOne(() => GalleryEntity, (entity) => entity.artWorks, { nullable: false })
  @JoinColumn({ name: 'gallery_id' })
  public gallery: GalleryEntity;

  @ManyToMany(() => ExpositionEntity, (entity) => entity.artWorksList)
  expositions: ExpositionEntity[];
}
