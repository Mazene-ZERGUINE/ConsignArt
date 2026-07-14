export const ArtWorkStatusEnum = {
  ON_LOAN: 'on_loan',
  AVAILABLE: 'available',
  SOLD: 'sold',
  RETURNED: 'returned',
} as const;

export type ArtWorkStatus = (typeof ArtWorkStatusEnum)[keyof typeof ArtWorkStatusEnum];
