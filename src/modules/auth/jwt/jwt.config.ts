import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { InvalideEnvConfigException } from '../../../core/exceptions/invalide-env-config.exception';
import { type StringValue } from 'ms';

export const createJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret) throw new InvalideEnvConfigException(['JWT_SECRET']);

  return {
    secret,
    signOptions: {
      algorithm: 'HS256',
      expiresIn: configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN', '15m'),
    },
  };
};
