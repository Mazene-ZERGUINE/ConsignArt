import { ContractEntity } from '../entities/contract.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { CollectorEntity } from '../../collector/collector.entity';
import { InvoiceEntity } from '../entities/invoice.entity';
import { ReceiptEntity } from '../entities/receipt.entity';
import { SaleResponseDto } from '../dto/sale-response.dto';

export type LoadedContract = ContractEntity & {
  artWork: ArtWorkEntity & { owner: ArtistEntity; gallery: GalleryEntity };
  buyer: CollectorEntity;
  invoice: InvoiceEntity;
  receipt: ReceiptEntity;
};

export function toSaleDto(contract: LoadedContract): SaleResponseDto {
  return {
    id: contract.id,
    artWorkId: contract.artWork.id,
    artWorkTitle: contract.artWork.title,
    galleryId: contract.artWork.gallery.id,
    artistId: contract.artWork.owner.id,
    buyerId: contract.buyer.id,
    sellingPrice: contract.sellingPrice,
    galleryCommission: contract.galleryCommission,
    artistAmount: contract.artistSold,
    sellingDate: contract.sellingDate,
    invoiceId: contract.invoice.id,
    receiptId: contract.receipt.id,
  };
}
