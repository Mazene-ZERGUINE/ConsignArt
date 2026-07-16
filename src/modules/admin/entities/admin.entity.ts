import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';

@Entity('admin_entity')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => GalleryEntity, (entity) => entity.validatedByAdmin)
  validatedGalleries: GalleryEntity[];

  @OneToOne(() => UserEntity, (entity) => entity.admin)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
