import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CollectorUserResponseDto } from '../../shared/dto/base-user-response.dto';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import { toBase } from '../../shared/utils/users-dto.mappers';
import { ContractEntity } from '../sell-contracts/entities/contract.entity';

@Entity('collector_entity')
export class CollectorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'first_name', nullable: true, length: 255 })
  public firstName: string;

  @Column('varchar', { name: 'last_name', nullable: true, length: 255 })
  public lastName: string;

  @OneToMany(() => ContractEntity, (entity) => entity.buyer)
  contracts: ContractEntity[];

  @OneToOne(() => UserEntity, (entity) => entity.collector)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  public toCollectorDto(): CollectorUserResponseDto {
    return {
      ...toBase(this.user, this.id, UserRoles.COLLECTOR),
    };
  }
}
