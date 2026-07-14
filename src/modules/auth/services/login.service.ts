import { Injectable } from '@nestjs/common';
import { AuthTokenDto, JwtToken } from '../dto/auth-token.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { CryptoUtilsService } from '../../../shared/service/crypto-utils.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { NonValidatedGalleryException } from '../exceptions/non-validated-gallery.exception';
import { GetUserService } from '../../users/services/get-user.service';
import { JwtSignService } from './jwt-signe.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly getUser: GetUserService,
    private readonly cryptoService: CryptoUtilsService,
    private readonly jwtSigne: JwtSignService,
  ) {}

  public async execute(loginDto: LoginDto): Promise<AuthTokenDto> {
    const userEntity = await this.getUser.execute({ email: loginDto.email });
    await this.validatePassword(loginDto.password, userEntity.hashedPassword);

    this.isActivatedAccount(userEntity);

    const jwtTokens: JwtToken = await this.jwtSigne.execute(userEntity);

    return {
      user: userEntity.toUserResponseDto(),
      token: jwtTokens,
    };
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
