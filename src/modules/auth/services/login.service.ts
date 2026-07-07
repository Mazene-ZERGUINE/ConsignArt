import { Injectable } from '@nestjs/common';
import { AuthTokenDto, JwtToken } from '../dto/response/auth-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/request/login.dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { CryptoUtilsService } from '../../../shared/service/crypto-utils.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { NonValidatedGalleryException } from '../exceptions/non-validated-gallery.exception';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { GetUserService } from '../../users/services/get-user.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
    private readonly getUser: GetUserService,
    private readonly cryptoService: CryptoUtilsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(loginDto: LoginDto): Promise<AuthTokenDto> {
    const userEntity = await this.getUser.execute({ email: loginDto.email });
    await this.validatePassword(loginDto.password, userEntity.hashedPassword);

    this.isActivatedAccount(userEntity);

    const jwtTokens: JwtToken = await this.signTokens(userEntity);

    return {
      user: userEntity.toUserResponseDto(),
      token: jwtTokens,
    };
  }

  private async signTokens(userEntity: UserEntity): Promise<JwtToken> {
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // todo: improve JWT validity and fix magic number issue
      user: userEntity,
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return { accessToken, refreshToken };
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<void> {
    const isValidPassword = await this.cryptoService.validatePassword(password, hashedPassword);
    if (!isValidPassword) throw new InvalidCredentialsException();
  }

  private isActivatedAccount(userEntity: UserEntity): void {
    if (userEntity.userRole === UserRoles.GALLERY && !userEntity.gallery.isValidated)
      throw new NonValidatedGalleryException();
  }
}
