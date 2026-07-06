import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity])],
})
export class ArtistsModule {}
