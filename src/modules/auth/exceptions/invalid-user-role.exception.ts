import { UnauthorizedException } from '@nestjs/common';

export class InvalidUserRoleException extends UnauthorizedException {
  constructor() {
    super('Unauthorized Access: Invalid user role');
  }
}
