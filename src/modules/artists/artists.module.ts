import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './entities/artist.entity';
import { CreateArtistService } from './services/create-artist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity])],
  providers: [CreateArtistService],
  exports: [CreateArtistService],
})
export class ArtistsModule {}
