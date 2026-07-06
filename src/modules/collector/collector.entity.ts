import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('collector_entity')
export class CollectorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (entity) => entity.collector)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
