import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './entities/artist.entity';
import { CreateArtistService } from './services/create-artist.service';
import { TransferRequestEntity } from '../../shared/entities/transfer-request.entity';
import { ArtistController } from './artist.controller';
import { InitiateTransferRequestService } from './services/initiate-transfer-request.service';
import { UsersModule } from '../users/users.module';
import { GalleryEntity } from '../gallery/entities/gallery.entity';
import { WorksOfArtModule } from '../works-of-art/works_of_art.module';
import { AddArtworkService } from './services/add-art-work.service';

@Module({
  imports: [
    UsersModule,
    WorksOfArtModule,
    TypeOrmModule.forFeature([ArtistEntity, TransferRequestEntity, GalleryEntity]),
  ],
  providers: [CreateArtistService, InitiateTransferRequestService, AddArtworkService],
  exports: [CreateArtistService],
  controllers: [ArtistController],
})
export class ArtistsModule {}
