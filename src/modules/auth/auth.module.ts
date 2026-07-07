import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { SignupService } from './services/signup.service';
import { CollectorModule } from '../collector/collector.module';
import { GalleryModule } from '../gallery/gallery.module';
import { ArtistsModule } from '../artists/artists.module';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { LoginService } from './services/login.service';
import { UserEntity } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createJwtConfig } from './jwt/jwt.config';

@Module({
  imports: [
    // ============= Infra ============
    TypeOrmModule.forFeature([RefreshTokensEntity, UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createJwtConfig,
    }),

    // ============= Modules ============
    CollectorModule,
    GalleryModule,
    ArtistsModule,
    AdminModule,
  ],
  providers: [SignupService, LoginService],
  controllers: [AuthController],
})
export class AuthModule {}
