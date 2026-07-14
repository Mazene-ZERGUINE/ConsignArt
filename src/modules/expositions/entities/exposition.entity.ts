import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  type ExpositionType,
  ExpositionTypeEnum,
} from '../../../shared/enums/exposition-type.enum';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';

@Entity('exposition_entity')
export class ExpositionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'name', nullable: false })
  public name: string;

  @Column('date', { name: 'start_date', nullable: false })
  startDate: Date;

  @Column('date', { name: 'end_date', nullable: false })
  endDate: Date;

  @Column('simple-enum', { name: 'type', enum: ExpositionTypeEnum })
  expositionType: ExpositionType;

  @Column('varchar', { name: 'address', nullable: true })
  expositionAddress?: string;

  @Column('varchar', { name: 'zip_code', nullable: true, length: 5 })
  zipCode?: string;

  @Column('varchar', { name: 'city', nullable: true })
  city?: string;

  @Column('varchar', { name: 'virtual_link', nullable: true })
  virtualLink?: string;

  @ManyToOne(() => GalleryEntity, (entity) => entity.expositions, { nullable: false })
  @JoinColumn({ name: 'gallery_id' })
  gallery: GalleryEntity;

  @ManyToMany(() => ArtWorkEntity, (entity) => entity.expositions)
  @JoinTable({ name: 'art_work_exposition_entity' })
  artWorksList: ArtWorkEntity[];
}
