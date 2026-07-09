import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryEntity } from './entities/gallery.entity';
import { CreateGalleryService } from './services/create-gallery.service';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryEntity])],
  providers: [CreateGalleryService],
  exports: [CreateGalleryService],
})
export class GalleryModule {}
