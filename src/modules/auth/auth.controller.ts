import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../../shared/dto/create-user.dto';
import { SignupService } from './services/signup.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './services/login.service';
import { UserResponseDto } from '../../shared/dto/base-user-response.dto';
import { GetAuthenticatedUserService } from './services/get-authenticated-user.service';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { JwtRefreshGuard } from '../../core/guards/jwt-refresh.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { type Request } from 'express';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtPayload } from '../../core/types/jwt-payload.types';
import { LogoutService } from './services/logout.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signuUp: SignupService,
    private readonly logIn: LoginService,
    private readonly getAuthenticatedUser: GetAuthenticatedUserService,
    private readonly refresh: RefreshTokenService,
    private readonly logOut: LogoutService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint used for user signup and account creation (for all types of users), creates the a new UserEntity row and link it to the user type',
  })
  @ApiOkResponse({
    description: 'Return 200 OK when the user is successfully created',
  })
  public async signup(@Body() dto: CreateUserDto): Promise<void> {
    return await this.signuUp.execute(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used for all users login, returns a JWT token and status 200.OK uppon success, Unauthorized 401 otherwise',
  })
  @ApiOkResponse({
    description: 'Return 200 OK when the user is successfully logged in',
    type: AuthTokenDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Return 401 Unauthorized when the user is not authorized',
  })
  public async login(@Body() dto: LoginDto): Promise<AuthTokenDto> {
    return await this.logIn.execute(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used for authenticated users profile information, protected route',
  })
  @ApiOkResponse({
    description: 'Return 200 OK with the users profile when authenticated ',
  })
  public async me(@AuthUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.getAuthenticatedUser.execute(user.userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description:
      'Endpoint used to log the authenticated user out by revoking all their active refresh tokens',
  })
  public async logout(@AuthUser() user: AuthenticatedUser): Promise<void> {
    await this.logOut.execute(user.userId);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used for JWT tokens refresh, verify the token, revoke and rotate refresh and generate a new access',
  })
  public async refreshToken(@Req() request: Request): Promise<AuthTokenDto> {
    const user = request.user as JwtPayload & { refreshToken: string };
    return await this.refresh.execute(user.refreshToken, user.sub);
  }
}
