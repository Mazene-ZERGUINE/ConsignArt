export const UserRoles = {
  ADMIN: 'admin',
  GALLERY: 'gallery',
  ARTIST: 'artiste',
  COLLECTOR: 'collector',
} as const;
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const ArtWorkStatus = {
  AVAILABLE: 'available',
  ON_LOAN: 'on_loan',
  SOLD: 'sold',
  RETURNED: 'returned',
} as const;
export type ArtWorkStatusType = (typeof ArtWorkStatus)[keyof typeof ArtWorkStatus];

export const ExpositionType = {
  VIRTUAL: 'virtual',
  ON_SITE: 'on_site',
} as const;
export type ExpositionTypeType = (typeof ExpositionType)[keyof typeof ExpositionType];

export const ActivityStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
export type ActivityStatusType = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export const TransferRequestStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
export type TransferRequestStatusType = (typeof TransferRequestStatus)[keyof typeof TransferRequestStatus];

export type BaseUser = {
  userId: string;
  entityId: string;
  userRole: UserRole;
  email: string;
};

export type AdminUser = BaseUser & { userRole: 'admin' };
export type CollectorUser = BaseUser & { userRole: 'collector' };

export type GalleryUser = BaseUser & {
  userRole: 'gallery';
  galleryVerified: boolean;
  validatedAt: string | null;
  validatedByAdmin: AdminUser | null;
  associatedArtists: ArtistUser[];
};

export type GallerySummary = {
  userId: string;
  entityId: string;
  galleryVerified: boolean;
  email: string;
};

export type ArtistUser = BaseUser & {
  userRole: 'artiste';
  firstName: string | null;
  lastName: string | null;
  nationality: string | null;
  portfolioUrl: string | null;
  joinedGalleryAt: string | null;
  biography: string | null;
  gallery: GallerySummary | null;
};

export type AuthenticatedUser = AdminUser | CollectorUser | GalleryUser | ArtistUser;

export type AuthTokens = { accessToken: string; refreshToken: string };
export type AuthResponse = { user: AuthenticatedUser; token: AuthTokens };

export type ArtWorkResponse = {
  id: string;
  title: string;
  description: string;
  sellingPrice: number;
  reservationPrice: number;
  imageUrl: string;
  status: ArtWorkStatusType;
  artistFirstName: string | null;
  artistLastName: string | null;
  galleryName: string;
  exposingGallery: string | null;
  dimensions: { height: number | null; width: number | null; depth: number | null };
  participatedInExpositions: string[];
};

export type CreateArtWorkPayload = {
  title: string;
  description: string;
  creationYear: string;
  technique: string;
  width?: number;
  height?: number;
  depth?: number;
  sellingPrice: number;
  reservationPrice: number;
  imageUrl: string;
};

export type ArtistSummary = {
  userId: string;
  entityId: string;
  email: string;
  nationality: string;
  firstName: string;
  lastName: string;
};

export type TransferRequestResponse = {
  id: string;
  transferReason: string;
  status: TransferRequestStatusType;
  artistToTransfer: ArtistSummary;
  fromGallery: GallerySummary;
  toGallery: GallerySummary;
};

export type SaleResponse = {
  id: string;
  artWorkId: string;
  artWorkTitle: string;
  galleryId: string;
  artistId: string;
  buyerId: string;
  sellingPrice: number;
  galleryCommission: number;
  artistAmount: number;
  sellingDate: string;
  invoiceId: string;
  receiptId: string;
};

export type ExpositionResponse = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  expositionType: ExpositionTypeType;
  address: string | null;
  zipCode: string | null;
  city: string | null;
  virtualLink: string | null;
  galleryId: string;
  galleryName: string;
  artWorks: { id: string; title: string; status: ArtWorkStatusType }[];
};

export type LoanResponse = {
  id: string;
  artWorkId: string;
  artWorkTitle: string;
  fromGalleryId: string | null;
  toGalleryId: string | null;
  from: string;
  to: string;
  conditions: string | null;
};

export type GalleryStats = {
  artworksSoldByMonth: { month: string; count: number }[];
  totalSalesRevenue: number;
  totalGalleryCommission: number;
  topArtists: { artistId: string; firstName: string; lastName: string; salesCount: number }[];
  rotationRate: number;
};

export type ArtistStats = {
  totalSalesCount: number;
  totalRevenue: number;
  totalCommissionsPaid: number;
  availableArtworksCount: number;
};

export type AdminStats = {
  activeUsersCount: number;
  transactionsCount: number;
  transactionsVolume: number;
  totalPlatformCommissions: number;
};
