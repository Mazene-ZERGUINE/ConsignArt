import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  TransferRequestActionType,
  TransferRequestStatusEnum,
} from '../../../shared/enums/transfer-request.status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TransferRequestEntity } from '../../../shared/entities/transfer-request.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { RelationNotLoadedException } from '../../../core/exceptions/relation-not-loaded.exception';

@Injectable()
export class AcceptOrRefuseTransferRequest {
  constructor(
    @InjectRepository(TransferRequestEntity)
    private readonly transferRequestRepository: Repository<TransferRequestEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async execute(
    transferRequestId: string,
    actionType: TransferRequestActionType,
  ): Promise<void> {
    const transferRequest = await this.transferRequestRepository.findOne({
      where: { id: transferRequestId },
      relations: { artistToTransfer: true, toGallery: true },
    });

    if (!transferRequest) throw new NotFoundException('Transfer request not found');

    if (transferRequest.status !== TransferRequestStatusEnum.PENDING) {
      throw new BadRequestException('This transfer request has already been resolved');
    }

    await this.dataSource.transaction(async (manager) => {
      if (actionType === TransferRequestActionType.APPROVE) {
        const artist = transferRequest.artistToTransfer;
        if (!artist) throw new RelationNotLoadedException('artistToTransfer');
        if (!transferRequest.toGallery) throw new RelationNotLoadedException('toGallery');

        artist.gallery = transferRequest.toGallery;
        artist.joinedGalleryAt = new Date();
        await manager.save(ArtistEntity, artist);
      }

      transferRequest.status = actionType;
      await manager.save(TransferRequestEntity, transferRequest);
    });
  }
}
