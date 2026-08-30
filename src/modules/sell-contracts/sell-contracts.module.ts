import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { ReceiptEntity } from './entities/receipt.entity';
import { CommissionRulesModule } from '../commission-rules/commission-rules.module';
import { CreateSaleService } from './services/create-sale.service';
import { GetSalesService } from './services/get-sales.service';
import { SellContractsController } from './sell-contracts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity, InvoiceEntity, ReceiptEntity]),
    CommissionRulesModule,
  ],
  providers: [CreateSaleService, GetSalesService],
  controllers: [SellContractsController],
  exports: [GetSalesService],
})
export class SellContractsModule {}
