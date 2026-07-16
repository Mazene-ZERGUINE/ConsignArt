import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryEntity } from '../entities/gallery.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';
import { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { toGalleryDto } from '../mappers/gallery.mapper';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class UpdateGalleryService {
  constructor(
    @InjectRepository(GalleryEntity) private readonly galleryRepository: Repository<GalleryEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    galleryUserId: string,
    dto: UpdateGalleryDto,
  ): Promise<GalleryUserResponseDto> {
    if (requester.role !== UserRoles.ADMIN && requester.userId !== galleryUserId) {
      throw new ForbiddenException('You can only update your own gallery');
    }

    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new NotFoundException('Gallery not found');
    }

    const gallery = galleryUser.gallery;
    gallery.name = dto.name;
    await this.galleryRepository.save(gallery);

    return toGalleryDto(gallery);
  }
}
