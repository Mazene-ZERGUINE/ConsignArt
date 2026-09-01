import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Thrown when a request is well-formed and passes input validation, but violates
 * a domain business rule (e.g. an art work cap, a status transition constraint).
 * Caught by its own BusinessRuleViolationFilter instead of the generic one.
 */
export class BusinessRuleViolationException extends HttpException {
  constructor(
    message: string,
    public readonly rule: string,
  ) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
