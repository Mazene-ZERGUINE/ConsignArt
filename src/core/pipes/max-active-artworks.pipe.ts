import { BadRequestException, Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { type Request } from 'express';
import { CreateArtWorkDto } from '../../modules/works-of-art/dto/create-art-work.dto';
import { GetArtworkByArtistService } from '../../modules/works-of-art/services/get-art-work-by-artist.service';
import { JwtPayload } from '../types/jwt-payload.types';

export const MAX_ACTIVE_ARTWORKS_PER_ARTIST = 50;

@Injectable({ scope: Scope.REQUEST })
export class MaxActiveArtworksPipe implements PipeTransform<
  CreateArtWorkDto,
  Promise<CreateArtWorkDto>
> {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly getArtworksByArtist: GetArtworkByArtistService,
  ) {}

  public async transform(dto: CreateArtWorkDto): Promise<CreateArtWorkDto> {
    const user = this.request.user as JwtPayload;
    const activeArtworks = await this.getArtworksByArtist.execute(user.sub);

    if (activeArtworks.length >= MAX_ACTIVE_ARTWORKS_PER_ARTIST) {
      throw new BadRequestException(
        `An artist cannot have more than ${MAX_ACTIVE_ARTWORKS_PER_ARTIST} active art works at once`,
      );
    }

    return dto;
  }
}
