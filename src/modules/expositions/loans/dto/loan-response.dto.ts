export class LoanResponseDto {
  id: string;
  artWorkId: string;
  artWorkTitle: string;
  fromGalleryId: string | null;
  toGalleryId: string | null;
  from: Date;
  to: Date;
  conditions: string | null;
}
