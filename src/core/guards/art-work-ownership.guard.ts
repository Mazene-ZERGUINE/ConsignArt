import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtWorkEntity } from '../../modules/works-of-art/entities/art-work.entity';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import {
  ART_WORK_OWNERSHIP_KEY,
  type ArtWorkOwnerRelation,
} from '../../shared/decorators/require-art-work-ownership.decorator';
import { type JwtPayload } from '../types/jwt-payload.types';

/**
 * Ownership guard: verifies the art work referenced by the :id route param belongs
 * to the connected user, as its owning gallery and/or artist (per
 * @RequireArtWorkOwnership). Admins always pass. Must run after the global
 * JwtAccessGuard so request.user is already populated.
 */
@Injectable()
export class ArtWorkOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(ArtWorkEntity) private readonly artWorkRepository: Repository<ArtWorkEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRelations = this.reflector.getAllAndOverride<ArtWorkOwnerRelation[]>(
      ART_WORK_OWNERSHIP_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? ['gallery'];

    const request = context
      .switchToHttp()
      .getRequest<{ params: Record<string, string>; user?: JwtPayload }>();
    const user = request.user;
    if (!user) throw new ForbiddenException('no authenticated user');
    if (user.role === UserRoles.ADMIN) return true;

    const artWork = await this.artWorkRepository.findOne({
      where: { id: request.params.id },
      relations: { owner: { user: true }, gallery: { user: true } },
    });
    if (!artWork) throw new NotFoundException('Art work not found');

    const isOwningGallery =
      allowedRelations.includes('gallery') &&
      user.role === UserRoles.GALLERY &&
      artWork.gallery?.user?.userId === user.sub;
    const isOwningArtist =
      allowedRelations.includes('artist') &&
      user.role === UserRoles.ARTISTE &&
      artWork.owner?.user?.userId === user.sub;

    if (!isOwningGallery && !isOwningArtist) {
      throw new ForbiddenException('You do not own this art work');
    }

    return true;
  }
}
