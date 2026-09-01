import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserResponseDto } from '../../shared/dto/base-user-response.dto';
import { type UserRole, UserRoles } from '../../shared/enums/user-roles.enum';
import { ListUsersService } from './services/list-users.service';
import { GetUserProfileService } from './services/get-user-profile.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsers: ListUsersService,
    private readonly getUserProfile: GetUserProfileService,
  ) {}

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint reserved to admins to list every user account, optionally filtered by role',
  })
  public async findAll(@Query('role') role?: UserRole): Promise<UserResponseDto[]> {
    return this.listUsers.execute(
      role && Object.values(UserRoles).includes(role) ? role : undefined,
    );
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint reserved to admins to read a single user account by its user id',
  })
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.getUserProfile.execute(id);
  }
}
