import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../../src/core/guards/roles.guard';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';

describe('RolesGuard', () => {
  function buildContext(user: unknown) {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => undefined,
      getClass: () => undefined,
    } as never;
  }

  function buildGuard(requiredRoles: unknown) {
    const reflector = { getAllAndOverride: jest.fn(() => requiredRoles) };
    return { guard: new RolesGuard(reflector as never), reflector };
  }

  it('allows the request when the route declares no @Roles() at all', () => {
    const { guard } = buildGuard(undefined);
    const context = buildContext({ sub: 'user-id', role: UserRoles.COLLECTOR });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows the request when the route declares an empty @Roles()', () => {
    const { guard } = buildGuard([]);
    const context = buildContext({ sub: 'user-id', role: UserRoles.COLLECTOR });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows a user whose role is in the required list', () => {
    const { guard } = buildGuard([UserRoles.GALLERY, UserRoles.ADMIN]);
    const context = buildContext({ sub: 'user-id', role: UserRoles.GALLERY });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects a user whose role is not in the required list', () => {
    const { guard } = buildGuard([UserRoles.ADMIN]);
    const context = buildContext({ sub: 'user-id', role: UserRoles.COLLECTOR });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects when there is no authenticated user at all', () => {
    const { guard } = buildGuard([UserRoles.ADMIN]);
    const context = buildContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
