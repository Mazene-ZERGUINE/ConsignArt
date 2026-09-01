import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessRuleViolationException } from '../exceptions/business-rule-violation.exception';

/**
 * Dedicated filter for business rule violations, kept separate from the generic
 * GlobalExceptionsHandlerFilter so the response can carry the violated rule's name.
 */
@Catch(BusinessRuleViolationException)
export class BusinessRuleViolationFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessRuleViolationFilter.name);

  catch(exception: BusinessRuleViolationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    this.logger.warn(
      `Business rule violated [${exception.rule}] on ${request.method} ${request.url}: ${exception.message}`,
    );

    response.status(statusCode).json({
      success: false,
      code: statusCode,
      message: exception.message,
      rule: exception.rule,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
