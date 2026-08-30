import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../../works-of-art/entities/art-work-transfer-history.entity';
import { CollectorEntity } from '../../collector/collector.entity';
import { ContractEntity } from '../entities/contract.entity';
import { InvoiceEntity } from '../entities/invoice.entity';
import { ReceiptEntity } from '../entities/receipt.entity';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleResponseDto } from '../dto/sale-response.dto';
import { LoadedContract, toSaleDto } from '../mappers/sale.mapper';
import { CalculateCommissionService } from '../../commission-rules/services/calculate-commission.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';
import { type LoadedArtWork } from '../../works-of-art/mappers/art-work.mapper';

@Injectable()
export class CreateSaleService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly calculateCommission: CalculateCommissionService,
  ) {}

  public async execute(
    requester: AuthenticatedUser,
    dto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const artWork = (await manager.findOne(ArtWorkEntity, {
        where: { id: dto.artWorkId },
        relations: { owner: { user: true }, gallery: { user: true } },
      })) as LoadedArtWork | null;

      if (!artWork) throw new NotFoundException('Art work not found');
      this.assertCanSell(requester, artWork);

      if (artWork.status === ArtWorkStatusEnum.ON_LOAN) {
        throw new BadRequestException('An art work on loan cannot be sold');
      }
      if (artWork.status !== ArtWorkStatusEnum.AVAILABLE) {
        throw new BadRequestException('Only available art works can be sold');
      }

      const buyer = await manager.findOne(CollectorEntity, { where: { id: dto.buyerId } });
      if (!buyer) throw new NotFoundException('Buyer not found');

      const sellingPrice = dto.sellingPrice ?? artWork.sellingPrice;
      if (sellingPrice < artWork.reservationPrice) {
        throw new BadRequestException(
          'The selling price cannot be lower than the art work reserve price',
        );
      }

      const { galleryCommission, artistAmount } = this.calculateCommission.execute(sellingPrice);

      const contract = manager.create(ContractEntity, {
        artWork,
        buyer,
        sellingPrice,
        sellingDate: new Date(),
        galleryCommission,
        artistSold: artistAmount,
      });
      await manager.save(contract);

      const invoice = manager.create(InvoiceEntity, { contract, price: sellingPrice });
      await manager.save(invoice);

      const receipt = manager.create(ReceiptEntity, { contract });
      await manager.save(receipt);

      const history = manager.create(ArtWorkTransferHistoryEntity, {
        artWork,
        currentStatus: artWork.status,
        newStatus: ArtWorkStatusEnum.SOLD,
        isLoaned: false,
        fromGallery: artWork.gallery,
        toGallery: artWork.gallery,
      });
      await manager.save(history);

      await manager.update(ArtWorkEntity, artWork.id, { status: ArtWorkStatusEnum.SOLD });

      const loadedContract: LoadedContract = { ...contract, artWork, buyer, invoice, receipt };
      return toSaleDto(loadedContract);
    });
  }

  private assertCanSell(requester: AuthenticatedUser, artWork: LoadedArtWork): void {
    if (requester.role === UserRoles.ADMIN) return;
    if (requester.role === UserRoles.GALLERY && artWork.gallery.user?.userId === requester.userId) {
      return;
    }
    throw new ForbiddenException('Only the owning gallery or an admin can record a sale');
  }
}
