import { ExpositionEntity } from '../entities/exposition.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ExpositionResponseDto } from '../dto/exposition-response.dto';

export type LoadedExposition = ExpositionEntity & {
  gallery: GalleryEntity;
  artWorksList: ArtWorkEntity[];
};

export function toExpositionDto(exposition: LoadedExposition): ExpositionResponseDto {
  return {
    id: exposition.id,
    name: exposition.name,
    startDate: exposition.startDate,
    endDate: exposition.endDate,
    expositionType: exposition.expositionType,
    address: exposition.expositionAddress ?? null,
    zipCode: exposition.zipCode ?? null,
    city: exposition.city ?? null,
    virtualLink: exposition.virtualLink ?? null,
    galleryId: exposition.gallery.id,
    galleryName: exposition.gallery.name,
    artWorks: exposition.artWorksList.map((artWork) => ({
      id: artWork.id,
      title: artWork.title,
      status: artWork.status,
    })),
  };
}
