import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryEntity } from './gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryEntity])],
})
export class GalleryModule {}
