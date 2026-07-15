import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('refresh_tokens_entity')
export class RefreshTokensEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'hashed_token', nullable: false, unique: true })
  hashedToken: string;

  @Column('boolean', { name: 'is_revoked', default: false, nullable: false })
  isRevoked: boolean;

  @Column('date', { name: 'expires_at', nullable: false })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
