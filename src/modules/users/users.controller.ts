import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserResponseDto } from '../../shared/dto/base-user-response.dto';
import { type UserRole, UserRoles } from '../../shared/enums/user-roles.enum';
import { ListUsersService } from './services/list-users.service';
import { GetUserProfileService } from './services/get-user-profile.service';

@ApiTags('users')
@Roles(UserRoles.ADMIN)
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsers: ListUsersService,
    private readonly getUserProfile: GetUserProfileService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint reserved to admins to list every user account, optionally filtered by role',
  })
  public async findAll(
    @Query('role', new ParseEnumPipe(UserRoles, { optional: true })) role?: UserRole,
  ): Promise<UserResponseDto[]> {
    return this.listUsers.execute(role);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint reserved to admins to read a single user account by its user id',
  })
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.getUserProfile.execute(id);
  }
}
