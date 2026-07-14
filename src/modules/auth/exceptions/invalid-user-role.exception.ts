import { UnauthorizedException } from '@nestjs/common';

export class InvalidUserRoleException extends UnauthorizedException {
  constructor(message?: string) {
    super(`Unauthorized Access: Invalid user role ${message}`);
  }
}
