import { CollectorEntity } from '../collector.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CollectorUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { toBase } from '../../../shared/utils/users-dto.mappers';

export type CollectorWithRelations = CollectorEntity & { user: UserEntity };

export function toCollectorDto(collector: CollectorWithRelations): CollectorUserResponseDto {
  return {
    ...toBase(collector.user, collector.id, UserRoles.COLLECTOR),
  };
}
