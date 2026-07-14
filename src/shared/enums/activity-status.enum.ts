export const ActivityStatusEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type ActivityStatus = (typeof ActivityStatusEnum)[keyof typeof ActivityStatusEnum];
