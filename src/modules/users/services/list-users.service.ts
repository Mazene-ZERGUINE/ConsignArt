import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { GetUserService } from './get-user.service';
import { toUserResponseDto } from '../mappers/user.mapper';
import { UserResponseDto } from '../../../shared/dto/base-user-response.dto';
import { UserRole } from '../../../shared/enums/user-roles.enum';

@Injectable()
export class ListUsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(role?: UserRole): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: role ? { userRole: role } : {},
      select: { userId: true },
    });

    return Promise.all(
      users.map(async (user) => toUserResponseDto(await this.getUser.execute({ id: user.userId }))),
    );
  }
}
