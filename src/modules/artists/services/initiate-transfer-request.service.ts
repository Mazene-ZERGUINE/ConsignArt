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
import { UserEntity } from '../../users/entities/user.entity';
import { ArtistEntity } from '../entities/artist.entity';
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
    const toGalleryUser = await this.getUser.execute({ id: transferRequestDto.newGalleryId });

    await this.validateTransfer(toGalleryUser, artistUser.artist);

    const transferRequestEntity = this.transferRequestRepository.create({
      fromGallery: artistUser.artist.gallery ?? null,
      toGallery: toGalleryUser.gallery,
      initiatedByArtist: artistUser.artist,
      transferReason: transferRequestDto.reason,
      artistToTransfer: artistUser.artist,
    });

    await this.transferRequestRepository.save(transferRequestEntity);
  }

  private async validateTransfer(toGallery: UserEntity, artistUser: ArtistEntity) {
    if (!toGallery || toGallery.userRole !== UserRoles.GALLERY) {
      throw new NotFoundException('Transfer target gallery not found');
    }

    if (!toGallery.gallery.isValidated) {
      throw new BadRequestException("Can't transfer to gallery that isn't validated by admin yet");
    }

    if (toGallery.gallery.id === artistUser.gallery.id) {
      throw new ConflictException('Cannot transfer to the same gallery');
    }

    await this.alreadyHaveTransferRequest(artistUser.user.userId);
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
