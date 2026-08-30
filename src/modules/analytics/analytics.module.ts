import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from '../sell-contracts/entities/contract.entity';
import { ArtWorkEntity } from '../works-of-art/entities/art-work.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { GalleryEntity } from '../gallery/entities/gallery.entity';
import { UsersModule } from '../users/users.module';
import { GetGalleryStatsService } from './services/get-gallery-stats.service';
import { GetArtistStatsService } from './services/get-artist-stats.service';
import { GetAdminStatsService } from './services/get-admin-stats.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ContractEntity,
      ArtWorkEntity,
      UserEntity,
      ArtistEntity,
      GalleryEntity,
    ]),
  ],
  providers: [GetGalleryStatsService, GetArtistStatsService, GetAdminStatsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
