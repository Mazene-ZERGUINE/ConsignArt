import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateLoanService } from '../../../src/modules/expositions/loans/services/create-loan.service';
import { ArtWorkEntity } from '../../../src/modules/works-of-art/entities/art-work.entity';
import { GalleryEntity } from '../../../src/modules/gallery/entities/gallery.entity';
import { ArtWorkStatusEnum } from '../../../src/shared/enums/art-work-status.enum';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../src/core/types/authenticated-user.types';

describe('CreateLoanService', () => {
  const fromGallery = { id: 'from-gallery-id', user: { userId: 'gallery-user-id' } };
  const toGallery = { id: 'to-gallery-id' };

  const galleryRequester: AuthenticatedUser = {
    userId: 'gallery-user-id',
    email: 'gallery@example.com',
    role: UserRoles.GALLERY,
  };

  const buildArtWork = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'art-work-1',
    title: 'The Kiss',
    status: ArtWorkStatusEnum.AVAILABLE,
    gallery: fromGallery,
    ...overrides,
  });

  const buildDto = (overrides: Partial<Record<string, unknown>> = {}) => ({
    artWorkId: 'art-work-1',
    toGalleryId: toGallery.id,
    from: '2026-02-01',
    to: '2026-02-28',
    ...overrides,
  });

  function buildManager(artWork: unknown, foundToGallery: unknown = toGallery) {
    return {
      findOne: jest.fn((entity: unknown) => {
        if (entity === ArtWorkEntity) return Promise.resolve(artWork);
        if (entity === GalleryEntity) return Promise.resolve(foundToGallery);
        return Promise.resolve(null);
      }),
      create: jest.fn((_entity: unknown, obj: Record<string, unknown>) => obj),
      save: jest.fn((obj: Record<string, unknown>) => Promise.resolve({ id: 'generated-id', ...obj })),
      update: jest.fn(() => Promise.resolve()),
    };
  }

  function buildService(manager: ReturnType<typeof buildManager>) {
    const dataSource = {
      transaction: jest.fn((cb: (manager: unknown) => unknown) => cb(manager)),
    };
    return new CreateLoanService(dataSource as never);
  }

  it('throws BadRequestException when the loan end date is before the start date', async () => {
    const manager = buildManager(buildArtWork());
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, buildDto({ from: '2026-02-28', to: '2026-02-01' })),
    ).rejects.toThrow('The loan end date cannot be before its start date');
  });

  it('throws NotFoundException when the art work does not exist', async () => {
    const manager = buildManager(null);
    const service = buildService(manager);

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when the requester is not the owning gallery nor an admin', async () => {
    const manager = buildManager(buildArtWork());
    const service = buildService(manager);
    const otherGalleryRequester: AuthenticatedUser = {
      userId: 'someone-else',
      email: 'other@example.com',
      role: UserRoles.GALLERY,
    };

    await expect(service.execute(otherGalleryRequester, buildDto())).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws BadRequestException when the art work is already on loan', async () => {
    const manager = buildManager(buildArtWork({ status: ArtWorkStatusEnum.ON_LOAN }));
    const service = buildService(manager);

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(
      'This art work is already on loan',
    );
  });

  it('throws BadRequestException when the art work is not available (e.g. sold)', async () => {
    const manager = buildManager(buildArtWork({ status: ArtWorkStatusEnum.SOLD }));
    const service = buildService(manager);

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(
      'Only available art works can be lent',
    );
  });

  it('throws NotFoundException when the destination gallery does not exist', async () => {
    const manager = buildManager(buildArtWork(), null);
    const service = buildService(manager);

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException when lending to the same gallery', async () => {
    const manager = buildManager(buildArtWork(), fromGallery);
    const service = buildService(manager);

    await expect(
      service.execute(galleryRequester, buildDto({ toGalleryId: fromGallery.id })),
    ).rejects.toThrow('Cannot lend an art work to its own gallery');
  });

  it('records the loan and marks the art work as on_loan', async () => {
    const artWork = buildArtWork();
    const manager = buildManager(artWork);
    const service = buildService(manager);

    const result = await service.execute(galleryRequester, buildDto());

    expect(result.artWorkId).toBe(artWork.id);
    expect(result.toGalleryId).toBe(toGallery.id);
    expect(manager.update).toHaveBeenCalledWith(ArtWorkEntity, artWork.id, {
      status: ArtWorkStatusEnum.ON_LOAN,
    });
  });
});
