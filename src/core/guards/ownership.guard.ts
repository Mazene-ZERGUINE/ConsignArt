import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Type,
  mixin,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtWorkEntity } from '../../modules/works-of-art/entities/art-work.entity';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import { JwtPayload } from '../types/jwt-payload.types';

type ArtworkIdLocation = { in: 'params' | 'body'; key: string };
type AllowedOwner = 'gallery' | 'artist';
type OwnershipRequest = {
  user: JwtPayload;
  params: Record<string, string | undefined>;
  body?: Record<string, unknown>;
};

/**
 * Guard factory (same pattern as Passport's own `AuthGuard('jwt')`): returns a
 * guard class checking that the art work identified by `location` belongs to
 * the connected gallery and/or artist - admins always pass.
 */
export function OwnershipGuard(
  location: ArtworkIdLocation,
  allowedOwners: AllowedOwner[],
): Type<CanActivate> {
  @Injectable()
  class OwnershipGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(ArtWorkEntity)
      private readonly artWorkRepository: Repository<ArtWorkEntity>,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<OwnershipRequest>();
      const user = request.user;

      if (user.role === UserRoles.ADMIN) return true;

      const artWorkId =
        location.in === 'params'
          ? request.params[location.key]
          : (request.body?.[location.key] as string | undefined);
      if (!artWorkId) throw new ForbiddenException(`Missing art work id (${location.key})`);

      const artWork = await this.artWorkRepository.findOne({
        where: { id: artWorkId },
        relations: { owner: { user: true }, gallery: { user: true } },
      });
      if (!artWork) throw new NotFoundException('Art work not found');

      if (
        allowedOwners.includes('gallery') &&
        user.role === UserRoles.GALLERY &&
        artWork.gallery?.user?.userId === user.sub
      ) {
        return true;
      }
      if (
        allowedOwners.includes('artist') &&
        user.role === UserRoles.ARTISTE &&
        artWork.owner?.user?.userId === user.sub
      ) {
        return true;
      }

      throw new ForbiddenException('This art work does not belong to you');
    }
  }

  return mixin(OwnershipGuardMixin);
}
