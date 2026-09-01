import { SetMetadata } from '@nestjs/common';

export const ART_WORK_OWNERSHIP_KEY = 'artWorkOwnership';

export type ArtWorkOwnerRelation = 'gallery' | 'artist';

/**
 * Restricts a route (with an art work `:id` route param) to the gallery and/or artist
 * that owns it. Admins always pass. Enforced by ArtWorkOwnershipGuard.
 */
export const RequireArtWorkOwnership = (...allow: ArtWorkOwnerRelation[]) =>
  SetMetadata(
    ART_WORK_OWNERSHIP_KEY,
    allow.length > 0 ? allow : (['gallery'] as ArtWorkOwnerRelation[]),
  );
