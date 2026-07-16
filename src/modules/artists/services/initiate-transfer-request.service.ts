import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferRequestDto } from '../../../shared/dto/create-transfer-request.dto';
import { GetUserService } from '../../users/services/get-user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferRequestEntity } from '../../../shared/entities/transfer-request.entity';
import { Repository } from 'typeorm';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtistWithRelations } from '../mappers/artist.mapper';
import { GalleryWithRelations } from '../../gallery/mappers/gallery.mapper';
import { TransferRequestStatusEnum } from '../../../shared/enums/transfer-request.status.enum';

@Injectable()
export class InitiateTransferRequestService {
  constructor(
    @InjectRepository(TransferRequestEntity)
    private readonly transferRequestRepository: Repository<TransferRequestEntity>,

    private readonly getUser: GetUserService,
  ) {}

  public async execute(
    initiatorUserId: string,
    transferRequestDto: CreateTransferRequestDto,
  ): Promise<void> {
    const artistUser = await this.getUser.execute({ id: initiatorUserId });
    if (artistUser.userRole !== UserRoles.ARTISTE) {
      throw new NotFoundException('Initiating artist not found');
    }

    const toGalleryUser = await this.getUser.execute({ id: transferRequestDto.newGalleryId });
    if (toGalleryUser.userRole !== UserRoles.GALLERY) {
      throw new NotFoundException('Transfer target gallery not found');
    }

    const artist = artistUser.artist;
    await this.validateTransfer(toGalleryUser.gallery, artist);

    const transferRequestEntity = this.transferRequestRepository.create({
      fromGallery: artist.gallery ?? null,
      toGallery: toGalleryUser.gallery,
      initiatedByArtist: artist,
      transferReason: transferRequestDto.reason,
      artistToTransfer: artist,
    });

    await this.transferRequestRepository.save(transferRequestEntity);
  }

  private async validateTransfer(
    toGallery: GalleryWithRelations,
    artist: ArtistWithRelations,
  ): Promise<void> {
    if (!toGallery.isValidated) {
      throw new BadRequestException("Can't transfer to gallery that isn't validated by admin yet");
    }

    if (toGallery.id === artist.gallery?.id) {
      throw new ConflictException('Cannot transfer to the same gallery');
    }

    await this.alreadyHaveTransferRequest(artist.user.userId);
  }

  private async alreadyHaveTransferRequest(artistId: string): Promise<void> {
    const existingRequest = await this.transferRequestRepository.findOne({
      where: {
        artistToTransfer: { user: { userId: artistId } },
        status: TransferRequestStatusEnum.PENDING,
      },
    });
    if (existingRequest) throw new ConflictException('this artist already has a transfer request');
  }
}
