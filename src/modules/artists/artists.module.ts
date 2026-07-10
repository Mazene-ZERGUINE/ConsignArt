import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './entities/artist.entity';
import { CreateArtistService } from './services/create-artist.service';
import { TransferRequestEntity } from '../../shared/entities/transfer-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, TransferRequestEntity])],
  providers: [CreateArtistService],
  exports: [CreateArtistService],
})
export class ArtistsModule {}
