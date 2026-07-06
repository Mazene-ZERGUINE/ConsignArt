/**
 * CollectorModule
 *
 * - Compose un UserEntity
 * - Utilisé pour gérer les données / la logique spécifique aux collecteurs
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorEntity } from './collector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectorEntity])],
})
export class CollectorModule {}
