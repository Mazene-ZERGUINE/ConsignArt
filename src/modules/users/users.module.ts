import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GetUserService } from './services/get-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [GetUserService],
  exports: [GetUserService],
})
export class UsersModule {}
