/**
 * CollectorModule
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique aux collecteurs
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorEntity } from './collector.entity';
import { CreateCollectorService } from './services/create-collector.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollectorEntity])],
  providers: [CreateCollectorService],
  exports: [CreateCollectorService],
})
export class CollectorModule {}
