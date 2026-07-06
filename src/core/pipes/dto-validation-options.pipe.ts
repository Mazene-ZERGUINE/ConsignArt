import { BadRequestException, PipeTransform, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { FormattedValidationError } from '../types/api-exceptions.types';

/**
 * Format the validation errors return format to the FormattedValidationError shape
 *
 * Example
 * {
 *   field:  username,
 *   errors: ['username must be a string', 'username must be longer than or equal to 3 characters'],
 *   children: optional for nested types only
 * }
 */
const formatErrors = (errors: ValidationError[]): FormattedValidationError[] =>
  errors.map((err) => ({
    field: err.property,
    errors: err.constraints ? Object.values(err.constraints) : [],
    ...(err.children?.length && { children: formatErrors(err.children) }),
  }));

/**
 * Factory function returning the configured validation pipe called in the main.ts file
 *
 */
export const createDtoValidationPipe = (): PipeTransform => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors: ValidationError[]) =>
      new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        extras: formatErrors(errors),
      }),
  });
};
