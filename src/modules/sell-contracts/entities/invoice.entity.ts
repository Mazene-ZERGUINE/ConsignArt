import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContractEntity } from './contract.entity';
import { numericTransformer } from '../../../shared/utils/numeric.transformer';

@Entity('invoice_entity')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('decimal', { precision: 12, scale: 2, transformer: numericTransformer })
  price: number;

  @OneToOne(() => ContractEntity)
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
