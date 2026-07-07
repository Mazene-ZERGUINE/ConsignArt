import { InternalServerErrorException } from '@nestjs/common';

export class RelationNotLoadedException extends InternalServerErrorException {
  constructor(relation: string) {
    super(`Relation ${relation} not loaded`);
  }
}
