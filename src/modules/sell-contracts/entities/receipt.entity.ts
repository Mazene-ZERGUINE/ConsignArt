import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContractEntity } from './contract.entity';

@Entity('receipt_entity')
export class ReceiptEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => ContractEntity)
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
