import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../../../../core/types/jwt-payload.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookies = req.cookies as Record<string, string> | undefined;
          return cookies?.refreshToken ?? null;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken = cookies?.refreshToken;

    if (!refreshToken) throw new UnauthorizedException();

    return { ...payload, refreshToken };
  }
}
