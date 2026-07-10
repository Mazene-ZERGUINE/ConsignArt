import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryEntity } from './entities/gallery.entity';
import { CreateGalleryService } from './services/create-gallery.service';
import { AddArtistToGalleryService } from './services/add-artist-to-gallery.service';
import { GalleryController } from './gallery.controller';
import { UsersModule } from '../users/users.module';
import { SetArtistProfileService } from './services/set-artist-profile.service';
import { ArtistEntity } from '../artists/entities/artist.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([GalleryEntity, ArtistEntity])],
  providers: [CreateGalleryService, AddArtistToGalleryService, SetArtistProfileService],
  exports: [CreateGalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
