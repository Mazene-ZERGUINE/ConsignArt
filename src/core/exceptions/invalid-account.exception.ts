import { ForbiddenException } from '@nestjs/common';

export class InvalidAccountException extends ForbiddenException {
  constructor(message: string) {
    super(`Invalide account type: ${message}`);
  }
}
