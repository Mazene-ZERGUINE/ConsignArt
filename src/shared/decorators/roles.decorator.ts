import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-roles.enum';

export const ROLES_KEY = 'roles';

/** Restricts a route to the given user roles. Enforced by the global RolesGuard. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
