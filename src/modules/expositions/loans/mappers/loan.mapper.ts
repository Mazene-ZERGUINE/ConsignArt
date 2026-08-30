import { WorkArtLoanEntity } from '../../../works-of-art/entities/work-art-load.entity';
import { ArtWorkEntity } from '../../../works-of-art/entities/art-work.entity';
import { GalleryEntity } from '../../../gallery/entities/gallery.entity';
import { LoanResponseDto } from '../dto/loan-response.dto';

export type LoadedLoan = WorkArtLoanEntity & {
  workArt: ArtWorkEntity;
  fromGallery: GalleryEntity | null;
  toGallery: GalleryEntity | null;
};

export function toLoanDto(loan: LoadedLoan): LoanResponseDto {
  return {
    id: loan.id,
    artWorkId: loan.workArt.id,
    artWorkTitle: loan.workArt.title,
    fromGalleryId: loan.fromGallery?.id ?? null,
    toGalleryId: loan.toGallery?.id ?? null,
    from: loan.from,
    to: loan.to,
    conditions: loan.conditions ?? null,
  };
}
