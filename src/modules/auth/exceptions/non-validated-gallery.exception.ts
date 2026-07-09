import { ForbiddenException } from '@nestjs/common';

export class NonValidatedGalleryException extends ForbiddenException {
  constructor() {
    super('This gallery is not validated yet, please wait for the admin validation');
  }
}
