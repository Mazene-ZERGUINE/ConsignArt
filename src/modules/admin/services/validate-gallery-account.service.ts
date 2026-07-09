import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { Repository } from 'typeorm';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { InvalidAccountException } from '../../../core/exceptions/invalid-account.exception';
import { UserEntity } from '../../users/entities/user.entity';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class ValidateGalleryAccountService {
  constructor(
    @InjectRepository(GalleryEntity) private readonly galleryRepository: Repository<GalleryEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(galleryUserId: string, adminUserId: string): Promise<void> {
    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    const adminUser = await this.getUser.execute({ id: adminUserId });

    this.validateGalleryAccountAndRole(galleryUser);
    await this.persistUpdates(galleryUser.gallery, adminUser.admin);
  }

  private validateGalleryAccountAndRole(userEntity: UserEntity): void {
    if (userEntity.userRole !== UserRoles.GALLERY || !userEntity.gallery) {
      throw new InvalidAccountException(
        'account is not a gallery user or gallery account is not loaded',
      );
    }

    if (userEntity.gallery.isValidated)
      throw new InvalidAccountException('gallery account is already validated');
  }

  private async persistUpdates(gallery: GalleryEntity, admin: AdminEntity): Promise<void> {
    gallery.isValidated = true;
    gallery.validatedAt = new Date();
    gallery.validatedByAdmin = admin;

    await this.galleryRepository.save(gallery);
  }
}
