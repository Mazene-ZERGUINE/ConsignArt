/**
 * AuthController
 *
 * Utilisé pour gérer les requete liée à l'authentification (signup, login, refresh …)
 * Route les requêtes vers les bons services, ne contien aucun logique métier
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/request/create-user.dto';
import { SignupService } from './services/signup.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly signupService: SignupService) {}

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
}
