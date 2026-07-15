import { AdminEntity } from '../entities/admin.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

export type AdminWithRelations = AdminEntity & { user: UserEntity };

export function toAdminDto(admin: AdminWithRelations): AdminUserResponseDto {
  return {
    ...toBase(admin.user, admin.id, UserRoles.ADMIN),
  };
}
