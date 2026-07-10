import { Injectable } from '@nestjs/common';
import { TransferRequestsResponseDto } from '../../../shared/dto/transfer-requests-response.dto';
import { TransferRequestStatus } from '../../../shared/enums/transfer-request.status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferRequestEntity } from '../../../shared/entities/transfer-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetTransferRequestsService {
  constructor(
    @InjectRepository(TransferRequestEntity)
    private readonly transferRequestRepository: Repository<TransferRequestEntity>,
  ) {}

  public async execute(status?: TransferRequestStatus): Promise<TransferRequestsResponseDto[]> {
    const transferRequests = await this.transferRequestRepository.find({
      where: status ? { status } : {},
      relations: {
        fromGallery: { user: true },
        toGallery: { user: true },
        artistToTransfer: { user: true },
      },
    });
    return transferRequests.map((transferRequest) => transferRequest.toResponseDto());
  }
}
