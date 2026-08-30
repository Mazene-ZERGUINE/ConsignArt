import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateExpositionService } from '../../../src/modules/expositions/services/create-exposition.service';
import { ArtWorkEntity } from '../../../src/modules/works-of-art/entities/art-work.entity';
import { ArtWorkStatusEnum } from '../../../src/shared/enums/art-work-status.enum';
import { ExpositionTypeEnum } from '../../../src/shared/enums/exposition-type.enum';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../src/core/types/authenticated-user.types';

describe('CreateExpositionService', () => {
  const gallery = { id: 'gallery-id', name: 'My Gallery' };
  const otherGallery = { id: 'other-gallery-id', name: 'Other Gallery' };

  const galleryRequester: AuthenticatedUser = {
    userId: 'gallery-user-id',
    email: 'gallery@example.com',
    role: UserRoles.GALLERY,
  };

  const buildDto = (overrides: Partial<Record<string, unknown>> = {}) => ({
    name: 'Impressionists',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    expositionType: ExpositionTypeEnum.ON_SITE,
    artWorkIds: ['art-work-1'],
    ...overrides,
  });

  const buildArtWork = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 'art-work-1',
    title: 'Sunflowers',
    status: ArtWorkStatusEnum.AVAILABLE,
    gallery,
    ...overrides,
  });

  function buildManager(artWorks: unknown[]) {
    return {
      find: jest.fn((entity: unknown) => {
        if (entity === ArtWorkEntity) return Promise.resolve(artWorks);
        return Promise.resolve([]);
      }),
      create: jest.fn((_entity: unknown, obj: Record<string, unknown>) => obj),
      save: jest.fn((obj: Record<string, unknown>) => Promise.resolve({ id: 'generated-id', ...obj })),
      update: jest.fn(() => Promise.resolve()),
    };
  }

  function buildService(manager: ReturnType<typeof buildManager>, galleryUser: unknown) {
    const dataSource = {
      transaction: jest.fn((cb: (manager: unknown) => unknown) => cb(manager)),
    };
    const getUser = { execute: jest.fn(() => Promise.resolve(galleryUser)) };
    return new CreateExpositionService(dataSource as never, getUser as never);
  }

  it('throws ForbiddenException when the requester is not a gallery', async () => {
    const manager = buildManager([buildArtWork()]);
    const service = buildService(manager, { userRole: UserRoles.ARTISTE });

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(ForbiddenException);
  });

  it('throws BadRequestException when the end date is before the start date', async () => {
    const manager = buildManager([buildArtWork()]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    await expect(
      service.execute(galleryRequester, buildDto({ startDate: '2026-02-01', endDate: '2026-01-01' })),
    ).rejects.toThrow('The exposition end date cannot be before its start date');
  });

  it('throws BadRequestException when the art work list is empty', async () => {
    const manager = buildManager([]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    await expect(
      service.execute(galleryRequester, buildDto({ artWorkIds: [] })),
    ).rejects.toThrow('An exposition cannot be created with zero art works');
  });

  it('throws NotFoundException when an art work id cannot be found', async () => {
    const manager = buildManager([]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when an art work does not belong to the gallery', async () => {
    const manager = buildManager([buildArtWork({ gallery: otherGallery })]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(ForbiddenException);
  });

  it('throws BadRequestException when an art work is not available', async () => {
    const manager = buildManager([buildArtWork({ status: ArtWorkStatusEnum.ON_LOAN })]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    await expect(service.execute(galleryRequester, buildDto())).rejects.toThrow(
      'is not available and cannot join an exposition',
    );
  });

  it('creates the exposition and switches its art works to on_loan', async () => {
    const artWork = buildArtWork();
    const manager = buildManager([artWork]);
    const service = buildService(manager, { userRole: UserRoles.GALLERY, gallery });

    const result = await service.execute(galleryRequester, buildDto());

    expect(result.name).toBe('Impressionists');
    expect(result.galleryId).toBe(gallery.id);
    expect(result.artWorks).toEqual([{ id: artWork.id, title: artWork.title, status: ArtWorkStatusEnum.ON_LOAN }]);
    expect(manager.update).toHaveBeenCalledWith(ArtWorkEntity, artWork.id, {
      status: ArtWorkStatusEnum.ON_LOAN,
    });
  });
});
