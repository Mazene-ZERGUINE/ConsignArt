import { GetAdminStatsService } from '../../../src/modules/analytics/services/get-admin-stats.service';

describe('GetAdminStatsService', () => {
  function buildService(contracts: unknown[], counts: Record<string, number>) {
    const contractRepository = { find: jest.fn(() => Promise.resolve(contracts)) };
    const userRepository = {
      count: jest.fn(({ where }: { where: { userRole: string } }) =>
        Promise.resolve(counts[where.userRole] ?? 0),
      ),
    };
    const artistRepository = { count: jest.fn(() => Promise.resolve(counts.activeArtists ?? 0)) };
    const galleryRepository = {
      count: jest.fn(() => Promise.resolve(counts.validatedGalleries ?? 0)),
    };
    return new GetAdminStatsService(
      contractRepository as never,
      userRepository as never,
      artistRepository as never,
      galleryRepository as never,
    );
  }

  it('aggregates active users, transaction volume and platform commissions', async () => {
    const contracts = [
      { sellingPrice: 10000, galleryCommission: 3500 },
      { sellingPrice: 25000, galleryCommission: 7500 },
    ];
    const service = buildService(contracts, {
      activeArtists: 3,
      validatedGalleries: 2,
      collector: 5,
      admin: 1,
    });

    const result = await service.execute();

    expect(result).toEqual({
      activeUsersCount: 11,
      transactionsCount: 2,
      transactionsVolume: 35000,
      totalPlatformCommissions: 11000,
    });
  });
});
