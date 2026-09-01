import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse, HttpExceptionResponse } from '../types/api-exceptions.types';

type ResolvedException = { statusCode: number; message: string; extras?: Record<string, unknown> };

@Catch()
export class GlobalExceptionsHandlerFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsHandlerFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, extras } = this.resolveException(exception);

    const INTERNAL_SERVER_ERROR_THRESHOLD: number = HttpStatus.INTERNAL_SERVER_ERROR;
    if (statusCode >= INTERNAL_SERVER_ERROR_THRESHOLD) {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorBody: ApiErrorResponse = {
      success: false,
      code: statusCode,
      message,
      ...(extras !== undefined && { extras }),
    };

    response.status(statusCode).json({
      ...errorBody,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveException(exception: unknown): ResolvedException {
    if (!(exception instanceof HttpException)) {
      // Never leak raw error messages/stacks for unexpected errors, they are logged above instead.
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return { statusCode, message: exceptionResponse };
    }

    const body = exceptionResponse as HttpExceptionResponse;
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : (body.message ?? exception.message);
    return { statusCode, message, extras: body.extras };
  }
}
