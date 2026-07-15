import { plainToInstance } from 'class-transformer';
import { ArtWorkEntity } from '../entities/art-work.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ExpositionEntity } from '../../expositions/entities/exposition.entity';
import { ArtWorkPassthrough, ArtWorkResponseDto } from '../dto/art-work-response.dto';

type ExpositionWithRelations = ExpositionEntity & { gallery: GalleryEntity };

export type LoadedArtWork = ArtWorkEntity & {
  owner: ArtistEntity;
  gallery: GalleryEntity;
  expositions: ExpositionWithRelations[];
};

export function toArtWorkDto(artWork: LoadedArtWork): ArtWorkResponseDto {
  const [firstExposition] = artWork.expositions;

  return Object.assign(
    plainToInstance(ArtWorkPassthrough, artWork, { excludeExtraneousValues: true }),
    {
      artistFirstName: artWork.owner.firstName,
      artistLastName: artWork.owner.lastName,
      galleryName: artWork.gallery.name,
      exposingGallery: firstExposition ? firstExposition.gallery.name : null,
      dimensions: {
        height: artWork.height,
        width: artWork.width,
        depth: artWork.depth,
      },
      participatedInExpositions: artWork.expositions.map((exposition) => exposition.name),
    },
  );
}
