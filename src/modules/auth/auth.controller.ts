/**
 * AuthController
 *
 * Utilisé pour gérer les requete liée à l'authentification (signup, login, refresh …)
 * Route les requêtes vers les bons services, ne contien aucun logique métier
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/request/create-user.dto';
import { SignupService } from './services/signup.service';
import { AuthTokenDto } from './dto/response/auth-token.dto';
import { LoginDto } from './dto/request/login.dto';
import { LoginService } from './services/login.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupService: SignupService,
    private readonly loginService: LoginService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint used for user signup and account creation (for all types of users), creates the a new UserEntity row and link it to the user type',
  })
  @ApiOkResponse({
    description: 'Return 200 OK when the user is successfully created',
  })
  async signup(@Body() dto: CreateUserDto): Promise<void> {
    return await this.signupService.execute(dto);
  }

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
  async login(@Body() dto: LoginDto): Promise<AuthTokenDto> {
    return await this.loginService.execute(dto);
  }
}
