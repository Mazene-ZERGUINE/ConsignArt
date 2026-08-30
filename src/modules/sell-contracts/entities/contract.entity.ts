import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectorEntity } from '../../collector/collector.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { numericTransformer } from '../../../shared/utils/numeric.transformer';
import { InvoiceEntity } from './invoice.entity';
import { ReceiptEntity } from './receipt.entity';

@Entity('contract_entity')
export class ContractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('decimal', {
    name: 'selling_price',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  public sellingPrice: number;

  @OneToOne(() => ArtWorkEntity)
  @JoinColumn({ name: 'art_work_id' })
  artWork: ArtWorkEntity;

  @Column('date', { name: 'selling_date', default: () => 'CURRENT_TIMESTAMP' })
  sellingDate: Date;

  @Column('decimal', {
    name: 'gallery_commission',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  public galleryCommission: number;

  @Column('decimal', {
    name: 'artist_sold',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  artistSold: number;

  @ManyToOne(() => CollectorEntity, (entity) => entity.contracts)
  @JoinColumn({ name: 'buyer_id' })
  buyer: CollectorEntity;

  @OneToOne(() => InvoiceEntity, (entity) => entity.contract)
  invoice?: InvoiceEntity;

  @OneToOne(() => ReceiptEntity, (entity) => entity.contract)
  receipt?: ReceiptEntity;
}
