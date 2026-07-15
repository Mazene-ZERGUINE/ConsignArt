import { Expose } from 'class-transformer';

import type { ArtWorkStatus } from '../../../shared/enums/art-work-status.enum';

export class ArtWorkDimensions {
  height: number | null;
  width: number | null;
  depth: number | null;
}

export class ArtWorkPassthrough {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  sellingPrice: number;

  @Expose()
  reservationPrice: number;

  @Expose()
  imageUrl: string;

  @Expose()
  status: ArtWorkStatus;
}

export class ArtWorkResponseDto extends ArtWorkPassthrough {
  artistFirstName: string | null;
  artistLastName: string | null;
  galleryName: string;
  exposingGallery: string | null;
  dimensions: ArtWorkDimensions;
  participatedInExpositions: string[];
}
