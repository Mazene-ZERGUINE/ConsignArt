import type { ExpositionType } from '../../../shared/enums/exposition-type.enum';
import type { ArtWorkStatus } from '../../../shared/enums/art-work-status.enum';

export class ExpositionArtWorkSummary {
  id: string;
  title: string;
  status: ArtWorkStatus;
}

export class ExpositionResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  expositionType: ExpositionType;
  address: string | null;
  zipCode: string | null;
  city: string | null;
  virtualLink: string | null;
  galleryId: string;
  galleryName: string;
  artWorks: ExpositionArtWorkSummary[];
}
