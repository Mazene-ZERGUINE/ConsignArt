import { Injectable } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { toUserResponseDto } from '../mappers/user.mapper';
import { UserResponseDto } from '../../../shared/dto/base-user-response.dto';

@Injectable()
export class GetUserProfileService {
  constructor(private readonly getUser: GetUserService) {}

  public async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.getUser.execute({ id: userId });
    return toUserResponseDto(user);
  }
}
