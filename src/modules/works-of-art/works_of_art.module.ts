import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from './entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from './entities/art-work-transfer-history.entity';
import { ExpositionEntity } from '../expositions/entities/exposition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtWorkEntity, ArtWorkTransferHistoryEntity, ExpositionEntity]),
  ],
})
export class WorksOfArtModule {}
