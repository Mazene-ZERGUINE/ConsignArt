import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRoles } from '../../shared/enums/user-roles.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('no authenticated user');
    if (user.role !== UserRoles.ADMIN) {
      throw new ForbiddenException('admin role required');
    }
    return true;
  }
}
