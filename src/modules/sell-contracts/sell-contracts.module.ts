import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { ReceiptEntity } from './entities/receipt.entity';
import { ArtWorkEntity } from '../works-of-art/entities/art-work.entity';
import { CommissionRulesModule } from '../commission-rules/commission-rules.module';
import { CreateSaleService } from './services/create-sale.service';
import { GetSalesService } from './services/get-sales.service';
import { SellContractsController } from './sell-contracts.controller';
import { FrenchDatePipe } from '../../core/pipes/french-date.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractEntity, InvoiceEntity, ReceiptEntity, ArtWorkEntity]),
    CommissionRulesModule,
  ],
  providers: [CreateSaleService, GetSalesService, FrenchDatePipe],
  controllers: [SellContractsController],
  exports: [GetSalesService],
})
export class SellContractsModule {}
