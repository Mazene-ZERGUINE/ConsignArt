import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtToken } from '../dto/auth-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtSignService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  public async execute(userEntity: UserEntity): Promise<JwtToken> {
    const { email, userRole: role, userId: sub } = userEntity;

    const accessToken = this.jwtService.sign(
      { sub, role, email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub, email, role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );

    const tokenEntity = this.refreshTokenRepository.create({
      hashedToken: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      user: userEntity,
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return { accessToken, refreshToken };
  }
}
