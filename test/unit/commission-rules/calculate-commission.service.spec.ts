import { CalculateCommissionService } from '../../../src/modules/commission-rules/services/calculate-commission.service';

describe('CalculateCommissionService', () => {
  const service = new CalculateCommissionService();

  it('applies the 40% rate when the selling price is at or below 5000', () => {
    const result = service.execute(5000);
    expect(result.commissionRate).toBe(0.4);
    expect(result.galleryCommission).toBe(2000);
    expect(result.artistAmount).toBe(3000);
  });

  it('applies the 35% rate when the selling price is between 5000 and 20000', () => {
    const result = service.execute(10000);
    expect(result.commissionRate).toBe(0.35);
    expect(result.galleryCommission).toBe(3500);
    expect(result.artistAmount).toBe(6500);
  });

  it('applies the 35% rate at the 20000 upper boundary', () => {
    const result = service.execute(20000);
    expect(result.commissionRate).toBe(0.35);
  });

  it('applies the 30% rate when the selling price is above 20000', () => {
    const result = service.execute(25000);
    expect(result.commissionRate).toBe(0.3);
    expect(result.galleryCommission).toBe(7500);
    expect(result.artistAmount).toBe(17500);
  });

  it('the gallery commission and artist amount always add up to the selling price', () => {
    for (const price of [100, 5000.01, 20000.01, 99999.99]) {
      const { galleryCommission, artistAmount } = service.execute(price);
      expect(Math.round((galleryCommission + artistAmount) * 100) / 100).toBe(price);
    }
  });
});
