import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { SignupService } from './services/signup.service';
import { CollectorModule } from '../collector/collector.module';
import { GalleryModule } from '../gallery/gallery.module';
import { ArtistsModule } from '../artists/artists.module';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    CollectorModule,
    GalleryModule,
    ArtistsModule,
    AdminModule,
    TypeOrmModule.forFeature([RefreshTokensEntity]),
  ],
  providers: [SignupService],
  controllers: [AuthController],
})
export class AuthModule {}
