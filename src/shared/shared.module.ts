import { Global, Module } from '@nestjs/common';
import { CryptoUtilsService } from './service/crypto-utils.service';
import { UsersModule } from '../modules/users/users.module';
import { GalleryModule } from '../modules/gallery/gallery.module';
import { AdminModule } from '../modules/admin/admin.module';
import { CollectorModule } from '../modules/collector/collector.module';
import { ArtistsModule } from '../modules/artists/artists.module';
import { CreateUsersService } from './service/create-users.service';

@Global()
@Module({
  imports: [UsersModule, GalleryModule, AdminModule, CollectorModule, ArtistsModule],
  providers: [CryptoUtilsService, CreateUsersService],
  exports: [CryptoUtilsService, CreateUsersService],
})
export class SharedModule {}
