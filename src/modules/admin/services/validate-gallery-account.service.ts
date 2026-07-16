import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { Repository } from 'typeorm';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { InvalidAccountException } from '../../../core/exceptions/invalid-account.exception';
import { AdminWithRelations } from '../mappers/admin.mapper';

@Injectable()
export class ValidateGalleryAccountService {
  constructor(
    @InjectRepository(GalleryEntity) private readonly galleryRepository: Repository<GalleryEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(galleryUserId: string, adminUserId: string): Promise<void> {
    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new InvalidAccountException('account is not a gallery user');
    }
    if (galleryUser.gallery.isValidated) {
      throw new InvalidAccountException('gallery account is already validated');
    }

    const adminUser = await this.getUser.execute({ id: adminUserId });
    if (adminUser.userRole !== UserRoles.ADMIN) {
      throw new InvalidAccountException('account is not an admin user');
    }

    await this.persistUpdates(galleryUser.gallery, adminUser.admin);
  }

  private async persistUpdates(gallery: GalleryEntity, admin: AdminWithRelations): Promise<void> {
    gallery.isValidated = true;
    gallery.validatedAt = new Date();
    gallery.validatedByAdmin = admin;

    await this.galleryRepository.save(gallery);
  }
}
