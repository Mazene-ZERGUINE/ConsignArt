import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryEntity } from '../entities/gallery.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { GalleryUserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { GalleryWithRelations, GalleryWithUser, toGalleryDto } from '../mappers/gallery.mapper';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';
import { GalleryDirectoryEntryDto } from '../dto/gallery-directory-entry.dto';

@Injectable()
export class GetGalleryService {
  constructor(
    @InjectRepository(GalleryEntity) private readonly galleryRepository: Repository<GalleryEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async getOne(
    requester: AuthenticatedUser,
    galleryUserId: string,
  ): Promise<GalleryUserResponseDto> {
    if (requester.role !== UserRoles.ADMIN && requester.userId !== galleryUserId) {
      throw new ForbiddenException('You can only access your own gallery');
    }

    const galleryUser = await this.getUser.execute({ id: galleryUserId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new NotFoundException('Gallery not found');
    }

    return toGalleryDto(galleryUser.gallery);
  }

  public async list(onlyPending?: boolean): Promise<GalleryUserResponseDto[]> {
    const galleries = (await this.galleryRepository.find({
      where: onlyPending ? { isValidated: false } : {},
      relations: {
        user: true,
        validatedByAdmin: { user: true },
        artists: { user: true, gallery: { user: true } },
      },
    })) as GalleryWithRelations[];

    return galleries.map(toGalleryDto);
  }

  /** Lightweight, validated-only gallery directory used to populate transfer target pickers. */
  public async listValidated(): Promise<GalleryDirectoryEntryDto[]> {
    const galleries = (await this.galleryRepository.find({
      where: { isValidated: true },
      relations: { user: true },
    })) as GalleryWithUser[];

    return galleries.map((gallery) => ({
      userId: gallery.user.userId,
      entityId: gallery.id,
      name: gallery.name,
      email: gallery.user.email,
    }));
  }
}
