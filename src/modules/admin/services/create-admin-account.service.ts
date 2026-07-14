import { Injectable } from '@nestjs/common';
import { CreateUsersService } from '../../../shared/service/create-users.service';
import { CryptoUtilsService } from '../../../shared/service/crypto-utils.service';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { RelationNotLoadedException } from '../../../core/exceptions/relation-not-loaded.exception';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UserResponseDto } from '../../../shared/dto/base-user-response.dto';

@Injectable()
export class CreateAdminAccountService {
  private static readonly PASSPHRASE_WORD_COUNT = 5;

  constructor(
    private readonly createUsers: CreateUsersService,
    private readonly getUser: GetUserService,
    private readonly cryptoService: CryptoUtilsService,
  ) {}

  public async execute(createAdminDto: CreateAdminDto): Promise<UserResponseDto> {
    const generatedPassword = this.cryptoService.generatePassphrase(
      CreateAdminAccountService.PASSPHRASE_WORD_COUNT,
    );

    const createdUser = await this.createUsers.execute({
      email: createAdminDto.email,
      password: generatedPassword,
      userRole: UserRoles.ADMIN,
    });

    const adminUser = await this.getUser.execute({ id: createdUser.userId });
    if (!adminUser.admin) throw new RelationNotLoadedException('admin');

    return adminUser.toUserResponseDto();
  }
}
