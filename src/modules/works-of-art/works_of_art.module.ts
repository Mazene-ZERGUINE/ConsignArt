import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from './entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from './entities/art-work-transfer-history.entity';
import { ExpositionEntity } from '../expositions/entities/exposition.entity';
import { UsersModule } from '../users/users.module';
import { CreateArtWorkService } from './services/create-art-work.service';
import { GetArtworkByArtistService } from './services/get-art-work-by-artist.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([ArtWorkEntity, ArtWorkTransferHistoryEntity, ExpositionEntity]),
  ],
  providers: [CreateArtWorkService, GetArtworkByArtistService],
  exports: [CreateArtWorkService, GetArtworkByArtistService],
})
export class WorksOfArtModule {}
