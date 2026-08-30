import { ForbiddenException } from '@nestjs/common';
import { GetGalleryStatsService } from '../../../src/modules/analytics/services/get-gallery-stats.service';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../src/core/types/authenticated-user.types';

describe('GetGalleryStatsService', () => {
  const gallery = { id: 'gallery-id' };
  const requester: AuthenticatedUser = {
    userId: 'gallery-user-id',
    email: 'gallery@example.com',
    role: UserRoles.GALLERY,
  };

  const artistA = { id: 'artist-a', firstName: 'Ada', lastName: 'Lovelace' };
  const artistB = { id: 'artist-b', firstName: 'Grace', lastName: 'Hopper' };

  const buildContract = (overrides: Partial<Record<string, unknown>> = {}) => ({
    sellingPrice: 10000,
    galleryCommission: 3500,
    sellingDate: '2026-01-15',
    artWork: { owner: artistA },
    ...overrides,
  });

  function buildService(contracts: unknown[], totalArtworksCount: number, galleryUser: unknown) {
    const contractRepository = { find: jest.fn(() => Promise.resolve(contracts)) };
    const artWorkRepository = { count: jest.fn(() => Promise.resolve(totalArtworksCount)) };
    const getUser = { execute: jest.fn(() => Promise.resolve(galleryUser)) };
    return new GetGalleryStatsService(
      contractRepository as never,
      artWorkRepository as never,
      getUser as never,
    );
  }

  it('throws ForbiddenException when the requester is not a gallery', async () => {
    const service = buildService([], 0, { userRole: UserRoles.ARTISTE });

    await expect(service.execute(requester)).rejects.toThrow(ForbiddenException);
  });

  it('computes revenue totals, monthly counts, top artists and rotation rate', async () => {
    const contracts = [
      buildContract({ sellingDate: '2026-01-15', artWork: { owner: artistA } }),
      buildContract({ sellingDate: '2026-01-20', artWork: { owner: artistA } }),
      buildContract({ sellingDate: '2026-02-01', artWork: { owner: artistB } }),
    ];
    const service = buildService(contracts, 10, { userRole: UserRoles.GALLERY, gallery });

    const result = await service.execute(requester);

    expect(result.totalSalesRevenue).toBe(30000);
    expect(result.totalGalleryCommission).toBe(10500);
    expect(result.artworksSoldByMonth).toEqual([
      { month: '2026-01', count: 2 },
      { month: '2026-02', count: 1 },
    ]);
    expect(result.topArtists[0]).toEqual({
      artistId: artistA.id,
      firstName: artistA.firstName,
      lastName: artistA.lastName,
      salesCount: 2,
    });
    expect(result.rotationRate).toBe(0.3);
  });

  it('returns a rotation rate of 0 when the gallery has no art works', async () => {
    const service = buildService([], 0, { userRole: UserRoles.GALLERY, gallery });

    const result = await service.execute(requester);

    expect(result.rotationRate).toBe(0);
  });
});
