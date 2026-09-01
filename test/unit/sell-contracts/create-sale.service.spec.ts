import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateSaleService } from '../../../src/modules/sell-contracts/services/create-sale.service';
import { CalculateCommissionService } from '../../../src/modules/commission-rules/services/calculate-commission.service';
import { ArtWorkEntity } from '../../../src/modules/works-of-art/entities/art-work.entity';
import { CollectorEntity } from '../../../src/modules/collector/collector.entity';
import { ArtWorkStatusEnum } from '../../../src/shared/enums/art-work-status.enum';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../src/core/types/authenticated-user.types';

describe('CreateSaleService', () => {
  const galleryUserId = 'gallery-user-id';
  const otherGalleryUserId = 'other-gallery-user-id';

  const buildArtWork = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'art-work-id',
    title: 'Starry Night',
    sellingPrice: 10000,
    reservationPrice: 8000,
    status: ArtWorkStatusEnum.AVAILABLE,
    owner: { id: 'artist-id', user: { userId: 'artist-user-id' } },
    gallery: { id: 'gallery-id', user: { userId: galleryUserId } },
    ...overrides,
  });

  const buyer = { id: 'buyer-id', user: { userId: 'buyer-user-id' } };

  const galleryRequester: AuthenticatedUser = {
    userId: galleryUserId,
    email: 'gallery@example.com',
    role: UserRoles.GALLERY,
  };

  function buildManager(artWork: unknown, foundBuyer: unknown = buyer) {
    return {
      findOne: jest.fn((entity: unknown) => {
        if (entity === ArtWorkEntity) return Promise.resolve(artWork);
        if (entity === CollectorEntity) return Promise.resolve(foundBuyer);
        return Promise.resolve(null);
      }),
      create: jest.fn((_entity: unknown, obj: Record<string, unknown>) => obj),
      save: jest.fn((obj: Record<string, unknown>) =>
        Promise.resolve({ id: 'generated-id', ...obj }),
      ),
      update: jest.fn(() => Promise.resolve()),
    };
  }

  function buildService(manager: ReturnType<typeof buildManager>) {
    const dataSource = {
      transaction: jest.fn((cb: (manager: unknown) => unknown) => cb(manager)),
    };
    return new CreateSaleService(dataSource as never, new CalculateCommissionService());
  }

  it('throws NotFoundException when the art work does not exist', async () => {
    const manager = buildManager(null);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, { artWorkId: 'missing', buyerId: buyer.id }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when the requester is not the owning gallery nor an admin', async () => {
    const artWork = buildArtWork();
    const manager = buildManager(artWork);
    const service = buildService(manager);
    const otherGallery: AuthenticatedUser = {
      userId: otherGalleryUserId,
      email: 'other@example.com',
      role: UserRoles.GALLERY,
    };

    await expect(
      service.execute(otherGallery, { artWorkId: artWork.id, buyerId: buyer.id }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws BadRequestException when the art work is on loan', async () => {
    const artWork = buildArtWork({ status: ArtWorkStatusEnum.ON_LOAN });
    const manager = buildManager(artWork);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, { artWorkId: artWork.id, buyerId: buyer.id }),
    ).rejects.toThrow('An art work on loan cannot be sold');
  });

  it('throws BadRequestException when the art work is not available', async () => {
    const artWork = buildArtWork({ status: ArtWorkStatusEnum.SOLD });
    const manager = buildManager(artWork);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, { artWorkId: artWork.id, buyerId: buyer.id }),
    ).rejects.toThrow('Only available art works can be sold');
  });

  it('throws NotFoundException when the buyer does not exist', async () => {
    const artWork = buildArtWork();
    const manager = buildManager(artWork, null);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, { artWorkId: artWork.id, buyerId: 'missing' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException when the selling price is below the reserve price', async () => {
    const artWork = buildArtWork({ reservationPrice: 8000 });
    const manager = buildManager(artWork);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, {
        artWorkId: artWork.id,
        buyerId: buyer.id,
        sellingPrice: 7000,
      }),
    ).rejects.toThrow('The selling price cannot be lower than the art work reserve price');
  });

  it('computes the commission tier, records the sale and marks the art work as sold', async () => {
    const artWork = buildArtWork({ sellingPrice: 10000 });
    const manager = buildManager(artWork);
    const service = buildService(manager);

    const result = await service.execute(galleryRequester, {
      artWorkId: artWork.id,
      buyerId: buyer.id,
    });

    expect(result.galleryCommission).toBe(3500);
    expect(result.artistAmount).toBe(6500);
    expect(result.sellingPrice).toBe(10000);
    expect(manager.update).toHaveBeenCalledWith(ArtWorkEntity, artWork.id, {
      status: ArtWorkStatusEnum.SOLD,
    });
    expect(manager.save).toHaveBeenCalledTimes(4);
  });
});
