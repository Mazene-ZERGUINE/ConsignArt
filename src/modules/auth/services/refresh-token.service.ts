import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { Repository } from 'typeorm';
import { JwtSignService } from './jwt-signe.service';
import { GetUserService } from '../../users/services/get-user.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
    private readonly getUser: GetUserService,
    private readonly jwtSign: JwtSignService,
  ) {}

  public async execute(refreshToken: string, userId: string): Promise<AuthTokenDto> {
    const actualToken = await this.validateToken(userId, refreshToken);
    const user = await this.getUser.execute({ id: userId });

    actualToken.isRevoked = true;
    await this.refreshTokenRepository.save(actualToken);

    const newTokens = await this.jwtSign.execute(user);
    return {
      user: user.toUserResponseDto(),
      token: newTokens,
    };
  }

  private async validateToken(userId: string, hashedToken: string): Promise<RefreshTokensEntity> {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { user: { userId }, hashedToken },
      relations: { user: true },
    });

    if (!tokenEntity) throw new UnauthorizedException();
    if (tokenEntity.expiresAt < new Date() || tokenEntity.isRevoked) {
      throw new UnauthorizedException('Invalid token or expired token');
    }

    return tokenEntity;
  }
}
