import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminService } from './services/create-admin.service';
import { ValidateGalleryAccountService } from './services/validate-gallery-account.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { GalleryModule } from '../gallery/gallery.module';
import { GalleryEntity } from '../gallery/entities/gallery.entity';
import { GetTransferRequestsService } from './services/get-transfer-requests.service';
import { TransferRequestEntity } from '../../shared/entities/transfer-request.entity';

@Module({
  imports: [
    UsersModule,
    GalleryModule,
    TypeOrmModule.forFeature([AdminEntity, GalleryEntity, TransferRequestEntity]),
  ],
  providers: [CreateAdminService, ValidateGalleryAccountService, GetTransferRequestsService],
  exports: [CreateAdminService],
  controllers: [AdminController],
})
export class AdminModule {}
