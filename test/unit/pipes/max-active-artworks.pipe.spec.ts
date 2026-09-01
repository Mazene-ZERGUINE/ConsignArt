import { BadRequestException } from '@nestjs/common';
import {
  MAX_ACTIVE_ARTWORKS_PER_ARTIST,
  MaxActiveArtworksPipe,
} from '../../../src/core/pipes/max-active-artworks.pipe';
import { UserRoles } from '../../../src/shared/enums/user-roles.enum';

describe('MaxActiveArtworksPipe', () => {
  const artistUserId = 'artist-user-id';
  const dto = { title: 'Untitled' } as never;

  function buildPipe(currentArtworksCount: number) {
    const request = { user: { sub: artistUserId, email: 'a@a.com', role: UserRoles.ARTISTE } };
    const getArtworksByArtist = {
      execute: jest.fn(() => Promise.resolve(Array.from({ length: currentArtworksCount }))),
    };

    const pipe = new MaxActiveArtworksPipe(request as never, getArtworksByArtist as never);
    return { pipe, getArtworksByArtist };
  }

  it('allows the creation when the artist is under the limit', async () => {
    const { pipe, getArtworksByArtist } = buildPipe(MAX_ACTIVE_ARTWORKS_PER_ARTIST - 1);

    await expect(pipe.transform(dto)).resolves.toBe(dto);
    expect(getArtworksByArtist.execute).toHaveBeenCalledWith(artistUserId);
  });

  it('blocks the creation once the artist has reached the limit', async () => {
    const { pipe } = buildPipe(MAX_ACTIVE_ARTWORKS_PER_ARTIST);

    await expect(pipe.transform(dto)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(dto)).rejects.toThrow(
      `cannot have more than ${MAX_ACTIVE_ARTWORKS_PER_ARTIST} active art works`,
    );
  });
});
