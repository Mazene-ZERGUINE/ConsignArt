import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../../../shared/dto/base-user-response.dto';

import { GetUserService } from '../../users/services/get-user.service';

@Injectable()
export class GetAuthenticatedUserService {
  constructor(private readonly getUser: GetUserService) {}

  public async execute(userId: string): Promise<UserResponseDto> {
    const userEntity = await this.getUser.execute({ id: userId });
    return userEntity.toUserResponseDto();
  }
}
