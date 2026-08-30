import { ForbiddenException } from '@nestjs/common';
import { GetArtistStatsService } from '../../../src/modules/analytics/services/get-artist-stats.service';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../src/core/types/authenticated-user.types';

describe('GetArtistStatsService', () => {
  const artist = { id: 'artist-id' };
  const requester: AuthenticatedUser = {
    userId: 'artist-user-id',
    email: 'artist@example.com',
    role: UserRoles.ARTISTE,
  };

  function buildService(contracts: unknown[], availableArtworksCount: number, artistUser: unknown) {
    const contractRepository = { find: jest.fn(() => Promise.resolve(contracts)) };
    const artWorkRepository = { count: jest.fn(() => Promise.resolve(availableArtworksCount)) };
    const getUser = { execute: jest.fn(() => Promise.resolve(artistUser)) };
    return new GetArtistStatsService(
      contractRepository as never,
      artWorkRepository as never,
      getUser as never,
    );
  }

  it('throws ForbiddenException when the requester is not an artist', async () => {
    const service = buildService([], 0, { userRole: UserRoles.GALLERY });

    await expect(service.execute(requester)).rejects.toThrow(ForbiddenException);
  });

  it('computes total sales, revenue, commissions paid and available art works', async () => {
    const contracts = [
      { artistSold: 6500, galleryCommission: 3500 },
      { artistSold: 3000, galleryCommission: 2000 },
    ];
    const service = buildService(contracts, 4, { userRole: UserRoles.ARTISTE, artist });

    const result = await service.execute(requester);

    expect(result).toEqual({
      totalSalesCount: 2,
      totalRevenue: 9500,
      totalCommissionsPaid: 5500,
      availableArtworksCount: 4,
    });
  });
});
