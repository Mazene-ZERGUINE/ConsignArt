import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { OwnershipGuard } from '../../../src/core/guards/ownership.guard';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';

describe('OwnershipGuard', () => {
  const artWorkId = 'art-work-id';

  function buildContext(
    user: unknown,
    params: Record<string, string> = {},
    body: Record<string, unknown> = {},
  ) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user, params, body }),
      }),
    } as never;
  }

  function buildGuard(
    allowedOwners: ('gallery' | 'artist')[],
    artWork: unknown,
    location: { in: 'params' | 'body'; key: string } = { in: 'params', key: 'id' },
  ) {
    const GuardClass = OwnershipGuard(location, allowedOwners);
    const repository = { findOne: jest.fn(() => Promise.resolve(artWork)) };
    return new GuardClass(repository);
  }

  it('always allows an admin, without even querying the repository', async () => {
    const guard = buildGuard(['gallery'], null);
    const context = buildContext({ sub: 'admin-id', role: UserRoles.ADMIN }, { id: artWorkId });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('allows the owning gallery when "gallery" is in allowedOwners', async () => {
    const artWork = { gallery: { user: { userId: 'gallery-user-id' } }, owner: { user: {} } };
    const guard = buildGuard(['gallery'], artWork);
    const context = buildContext(
      { sub: 'gallery-user-id', role: UserRoles.GALLERY },
      {
        id: artWorkId,
      },
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('rejects a non-owning gallery', async () => {
    const artWork = { gallery: { user: { userId: 'someone-else' } }, owner: { user: {} } };
    const guard = buildGuard(['gallery'], artWork);
    const context = buildContext(
      { sub: 'gallery-user-id', role: UserRoles.GALLERY },
      {
        id: artWorkId,
      },
    );

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('rejects the owning artist when "artist" is not in allowedOwners', async () => {
    const artWork = { gallery: { user: {} }, owner: { user: { userId: 'artist-user-id' } } };
    const guard = buildGuard(['gallery'], artWork);
    const context = buildContext(
      { sub: 'artist-user-id', role: UserRoles.ARTISTE },
      {
        id: artWorkId,
      },
    );

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('allows the owning artist when "artist" is in allowedOwners', async () => {
    const artWork = { gallery: { user: {} }, owner: { user: { userId: 'artist-user-id' } } };
    const guard = buildGuard(['gallery', 'artist'], artWork);
    const context = buildContext(
      { sub: 'artist-user-id', role: UserRoles.ARTISTE },
      {
        id: artWorkId,
      },
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('throws NotFoundException when the art work does not exist', async () => {
    const guard = buildGuard(['gallery'], null);
    const context = buildContext(
      { sub: 'gallery-user-id', role: UserRoles.GALLERY },
      {
        id: artWorkId,
      },
    );

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('reads the art work id from the body when configured to do so', async () => {
    const artWork = { gallery: { user: { userId: 'gallery-user-id' } }, owner: { user: {} } };
    const guard = buildGuard(['gallery'], artWork, { in: 'body', key: 'artWorkId' });
    const context = buildContext(
      { sub: 'gallery-user-id', role: UserRoles.GALLERY },
      {},
      { artWorkId },
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
