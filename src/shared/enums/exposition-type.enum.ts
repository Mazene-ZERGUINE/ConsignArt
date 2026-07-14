export const ExpositionTypeEnum = {
  VIRTUAL: 'virtual',
  ON_SITE: 'on_site',
} as const;

export type ExpositionType = (typeof ExpositionTypeEnum)[keyof typeof ExpositionTypeEnum];
