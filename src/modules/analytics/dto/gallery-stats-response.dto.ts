export class MonthlySalesCountDto {
  month: string;
  count: number;
}

export class TopArtistDto {
  artistId: string;
  firstName: string;
  lastName: string;
  salesCount: number;
}

export class GalleryStatsResponseDto {
  artworksSoldByMonth: MonthlySalesCountDto[];
  totalSalesRevenue: number;
  totalGalleryCommission: number;
  topArtists: TopArtistDto[];
  rotationRate: number;
}
