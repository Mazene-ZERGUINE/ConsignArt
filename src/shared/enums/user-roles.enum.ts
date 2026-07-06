export const UserRoles = {
  ADMIN: 'admin',
  GALLERY: 'gallery',
  ARTISTE: 'artiste',
  COLLECTOR: 'collector',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
