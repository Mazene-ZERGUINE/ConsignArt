import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminService } from './services/create-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [CreateAdminService],
  exports: [CreateAdminService],
})
export class AdminModule {}
