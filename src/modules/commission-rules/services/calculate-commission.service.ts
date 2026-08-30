import { Injectable } from '@nestjs/common';

export type CommissionBreakdown = {
  commissionRate: number;
  galleryCommission: number;
  artistAmount: number;
};

@Injectable()
export class CalculateCommissionService {
  private static readonly LOW_TIER_THRESHOLD = 5000;
  private static readonly MID_TIER_THRESHOLD = 20000;
  private static readonly LOW_TIER_RATE = 0.4;
  private static readonly MID_TIER_RATE = 0.35;
  private static readonly HIGH_TIER_RATE = 0.3;

  public execute(sellingPrice: number): CommissionBreakdown {
    const commissionRate = this.resolveRate(sellingPrice);
    const galleryCommission = Math.round(sellingPrice * commissionRate * 100) / 100;
    const artistAmount = Math.round((sellingPrice - galleryCommission) * 100) / 100;

    return { commissionRate, galleryCommission, artistAmount };
  }

  private resolveRate(sellingPrice: number): number {
    if (sellingPrice <= CalculateCommissionService.LOW_TIER_THRESHOLD) {
      return CalculateCommissionService.LOW_TIER_RATE;
    }
    if (sellingPrice <= CalculateCommissionService.MID_TIER_THRESHOLD) {
      return CalculateCommissionService.MID_TIER_RATE;
    }
    return CalculateCommissionService.HIGH_TIER_RATE;
  }
}
