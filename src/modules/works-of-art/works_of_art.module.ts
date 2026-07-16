import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from './entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from './entities/art-work-transfer-history.entity';
import { ExpositionEntity } from '../expositions/entities/exposition.entity';
import { UsersModule } from '../users/users.module';
import { CreateArtWorkService } from './services/create-art-work.service';
import { GetArtworkByArtistService } from './services/get-art-work-by-artist.service';
import { GetArtWorkService } from './services/get-art-work.service';
import { UpdateArtWorkService } from './services/update-art-work.service';
import { DeleteArtWorkService } from './services/delete-art-work.service';
import { ChangeArtWorkStatusService } from './services/change-art-work-status.service';
import { ArtworksController } from './artworks.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([ArtWorkEntity, ArtWorkTransferHistoryEntity, ExpositionEntity]),
  ],
  providers: [
    CreateArtWorkService,
    GetArtworkByArtistService,
    GetArtWorkService,
    UpdateArtWorkService,
    DeleteArtWorkService,
    ChangeArtWorkStatusService,
  ],
  exports: [CreateArtWorkService, GetArtworkByArtistService],
  controllers: [ArtworksController],
})
export class WorksOfArtModule {}
