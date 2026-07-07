import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../core/types/jwt-payload.types';
import { AuthenticatedUser } from '../../core/types/authenticated-user.types';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const payload = request.user as JwtPayload;

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  },
);
