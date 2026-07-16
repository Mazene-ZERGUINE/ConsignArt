import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GetUserService } from './services/get-user.service';
import { ListUsersService } from './services/list-users.service';
import { GetUserProfileService } from './services/get-user-profile.service';

import { UsersController } from './users.controller';
import { RefreshTokensEntity } from '../auth/entities/refresh-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RefreshTokensEntity])],
  providers: [GetUserService, ListUsersService, GetUserProfileService],
  exports: [GetUserService],
  controllers: [UsersController],
})
export class UsersModule {}
