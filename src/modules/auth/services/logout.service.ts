import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';

@Injectable()
export class LogoutService {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  public async execute(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { userId }, isRevoked: false },
      { isRevoked: true },
    );
  }
}
