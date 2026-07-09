import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { WorksOfArtModule } from './modules/works-of-art/works_of_art.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { CollectorModule } from './modules/collector/collector.module';
import { SellContractsModule } from './modules/sell-contracts/sell-contracts.module';
import { CommissionRulesModule } from './modules/commission-rules/commission-rules.module';
import { ExpositionsModule } from './modules/expositions/expositions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePath } from './core/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './core/config/typeorm.config';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // ============= Infra ============
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),

    // ============= Modules ============
    CoreModule,
    SharedModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    WorksOfArtModule,
    GalleryModule,
    CollectorModule,
    SellContractsModule,
    CommissionRulesModule,
    ExpositionsModule,
    AnalyticsModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
