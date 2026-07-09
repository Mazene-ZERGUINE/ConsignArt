import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminService } from './services/create-admin.service';
import { ValidateGalleryAccountService } from './services/validate-gallery-account.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { GalleryModule } from '../gallery/gallery.module';
import { GalleryEntity } from '../gallery/entities/gallery.entity';

@Module({
  imports: [UsersModule, GalleryModule, TypeOrmModule.forFeature([AdminEntity, GalleryEntity])],
  providers: [CreateAdminService, ValidateGalleryAccountService],
  exports: [CreateAdminService],
  controllers: [AdminController],
})
export class AdminModule {}
