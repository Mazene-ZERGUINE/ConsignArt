import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { ReceiptEntity } from './entities/receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity, InvoiceEntity, ReceiptEntity])],
})
export class SellContractsModule {}
