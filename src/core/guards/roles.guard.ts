import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-roles.enum';
import { JwtPayload } from '../types/jwt-payload.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user) throw new ForbiddenException('no authenticated user');
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
