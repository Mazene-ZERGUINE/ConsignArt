import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  TransferRequestActionType,
  TransferRequestStatus,
  TransferRequestStatusEnum,
} from '../../../shared/enums/transfer-request.status.enum';
import { DataSource } from 'typeorm';
import { TransferRequestEntity } from '../../../shared/entities/transfer-request.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { RelationNotLoadedException } from '../../../core/exceptions/relation-not-loaded.exception';

@Injectable()
export class AcceptOrRefuseTransferRequest {
  private readonly TRANSFER_REQUEST_ACTION_TO_STATUS: Record<
    TransferRequestActionType,
    TransferRequestStatus
  > = {
    [TransferRequestActionType.APPROVE]: TransferRequestStatusEnum.APPROVED,
    [TransferRequestActionType.REJECT]: TransferRequestStatusEnum.REJECTED,
  };

  constructor(private readonly dataSource: DataSource) {}

  public async execute(
    transferRequestId: string,
    actionType: TransferRequestActionType,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const transferRequest = await manager.findOne(TransferRequestEntity, {
        where: { id: transferRequestId },
        relations: { artistToTransfer: true, toGallery: true },
      });

      if (!transferRequest) {
        throw new NotFoundException('Transfer request not found');
      }

      if (transferRequest.status !== TransferRequestStatusEnum.PENDING) {
        throw new BadRequestException('This transfer request has already been resolved');
      }

      if (actionType === TransferRequestActionType.APPROVE) {
        const artist = transferRequest.artistToTransfer;
        if (!artist) throw new RelationNotLoadedException('artistToTransfer');
        if (!transferRequest.toGallery) throw new RelationNotLoadedException('toGallery');

        artist.gallery = transferRequest.toGallery;
        artist.joinedGalleryAt = new Date();
        await manager.save(ArtistEntity, artist);
      }

      transferRequest.status = this.TRANSFER_REQUEST_ACTION_TO_STATUS[actionType];
      await manager.save(TransferRequestEntity, transferRequest);
    });
  }
}
