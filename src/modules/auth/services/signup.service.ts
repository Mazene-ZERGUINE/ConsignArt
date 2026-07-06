import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { InvalidUserRoleException } from '../exceptions/invalid-user-role.exception';
import { UserEntity } from '../../users/user.entity';
import { CreateArtistService } from '../../artists/services/create-artist.service';
import { CreateAdminService } from '../../admin/services/create-admin.service';
import { CreateCollectorService } from '../../collector/services/create-collector.service';
import { CreateGalleryService } from '../../gallery/services/create-gallery.service';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { CryptoUtilsService } from '../../../shared/service/crypto-utils.service';

@Injectable()
export class SignupService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly createArtistService: CreateArtistService,
    private readonly createAdminService: CreateAdminService,
    private readonly createCollectorService: CreateCollectorService,
    private readonly createGalleryService: CreateGalleryService,
    private readonly cryptoService: CryptoUtilsService,
  ) {}

  get userRepository() {
    return this.dataSource.getRepository(UserEntity);
  }

  async execute(createUserDto: CreateUserDto): Promise<void> {
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
    createRoleEntity: (manager: EntityManager, user: UserEntity) => Promise<void>,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const savedUser = await manager.save(UserEntity, userEntity);
      await createRoleEntity(manager, savedUser);
    });
  }

  private async validateUser(createUserDto: CreateUserDto): Promise<void> {
    const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (userExists) throw new UserAlreadyExistsException();
  }
}
