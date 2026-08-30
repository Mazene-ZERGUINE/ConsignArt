import { Module } from '@nestjs/common';
import { CalculateCommissionService } from './services/calculate-commission.service';

@Module({
  providers: [CalculateCommissionService],
  exports: [CalculateCommissionService],
})
export class CommissionRulesModule {}
