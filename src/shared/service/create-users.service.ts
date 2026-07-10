import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../../modules/users/entities/user.entity';
import { InvalidUserRoleException } from '../../modules/auth/exceptions/invalid-user-role.exception';
import { DataSource, EntityManager } from 'typeorm';
import { UserAlreadyExistsException } from '../../modules/auth/exceptions/user-already-exists.exception';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateArtistService } from '../../modules/artists/services/create-artist.service';
import { CreateAdminService } from '../../modules/admin/services/create-admin.service';
import { CreateCollectorService } from '../../modules/collector/services/create-collector.service';
import { CreateGalleryService } from '../../modules/gallery/services/create-gallery.service';
import { CryptoUtilsService } from './crypto-utils.service';

@Injectable()
export class CreateUsersService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly createArtistService: CreateArtistService,
    private readonly createAdminService: CreateAdminService,
    private readonly createCollectorService: CreateCollectorService,
    private readonly createGalleryService: CreateGalleryService,
    private readonly cryptoService: CryptoUtilsService,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.validateUser(createUserDto);

    const userEntity = this.dataSource.getRepository(UserEntity).create({
      ...createUserDto,
      hashedPassword: await this.cryptoService.hashPasswordWithBcrypt(createUserDto.password),
    });

    switch (createUserDto.userRole) {
      case 'artiste':
        return this.persistUser(userEntity, (manager, user) =>
          this.createArtistService.execute(manager, user),
        );
      case 'collector':
        return await this.persistUser(userEntity, (manager, user) =>
          this.createCollectorService.execute(manager, user),
        );
      case 'gallery':
        return await this.persistUser(userEntity, (manager, user) =>
          this.createGalleryService.execute(manager, user),
        );
      case 'admin':
        return await this.persistUser(userEntity, (manager, user) =>
          this.createAdminService.execute(manager, user),
        );
      default:
        throw new InvalidUserRoleException();
    }
  }

  private async persistUser(
    userEntity: UserEntity,
    createRoleEntity: (manager: EntityManager, user: UserEntity) => Promise<unknown>,
  ): Promise<UserEntity> {
    return this.dataSource.transaction(async (manager) => {
      const savedUser = await manager.save(UserEntity, userEntity);
      await createRoleEntity(manager, savedUser);
      return savedUser;
    });
  }

  private async validateUser(createUserDto: CreateUserDto): Promise<void> {
    const userExists = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ email: createUserDto.email });
    if (userExists) throw new UserAlreadyExistsException();
  }
}
