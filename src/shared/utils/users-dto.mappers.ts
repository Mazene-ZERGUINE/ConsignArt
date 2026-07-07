import { UserEntity } from '../../modules/users/entities/user.entity';
import { BaseUserResponseDto } from '../dto/base-user-response.dto';
import { UserRole } from '../enums/user-roles.enum';

export function toBase<R extends UserRole>(
  user: UserEntity,
  entityId: string,
  role: R,
): BaseUserResponseDto<R> {
  return {
    userId: user.userId,
    email: user.email,
    entityId,
    userRole: role,
  };
}
