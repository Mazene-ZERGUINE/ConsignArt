import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from '../works-of-art/entities/art-work.entity';
import { ExpositionEntity } from './entities/exposition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpositionEntity, ArtWorkEntity])],
})
export class ExpositionsModule {}
