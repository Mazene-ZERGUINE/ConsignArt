import { ApiProperty } from '@nestjs/swagger';
import { type BaseUserResponseDto } from '../../../shared/dto/base-user-response.dto';

export type JwtToken = {
  accessToken: string;
  refreshToken: string;
};

export class AuthTokenDto {
  @ApiProperty({
    description: 'Users JWT Token after successful login (accessToken & refreshToken)',
  })
  public readonly token: JwtToken;

  @ApiProperty({
    description: 'Authenticated user data',
  })
  public readonly user: BaseUserResponseDto;

  constructor(token: JwtToken, user: BaseUserResponseDto) {
    this.token = token;
    this.user = user;
  }
}
