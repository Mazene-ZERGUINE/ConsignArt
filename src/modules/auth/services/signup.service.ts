import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../shared/dto/create-user.dto';
import { CreateUsersService } from '../../../shared/service/create-users.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { InvalidUserRoleException } from '../exceptions/invalid-user-role.exception';

@Injectable()
export class SignupService {
  constructor(private readonly createUser: CreateUsersService) {}

  public async execute(createUserDto: CreateUserDto): Promise<void> {
    if (createUserDto.userRole === UserRoles.ARTISTE) {
      throw new InvalidUserRoleException('Only galleries can create artists accounts');
    }

    await this.createUser.execute(createUserDto);
  }
}
