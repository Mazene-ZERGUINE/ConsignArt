import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CollectorUserResponseDto } from '../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import { toBase } from '../../shared/utils/users-dto.mappers';

@Entity('collector_entity')
export class CollectorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (entity) => entity.collector)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  public toCollectorDto(): CollectorUserResponseDto {
    return {
      ...toBase(this.user, this.id, UserRoles.COLLECTOR),
    };
  }
}
