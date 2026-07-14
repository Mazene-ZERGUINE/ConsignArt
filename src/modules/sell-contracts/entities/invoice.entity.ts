import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContractEntity } from './contract.entity';

@Entity('invoice_entity')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @OneToOne(() => ContractEntity)
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
