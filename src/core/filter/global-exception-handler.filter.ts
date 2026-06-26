import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse, HttpExceptionResponse } from '../types/api-exceptions.types';

@Catch(HttpException)
export class GlobalExceptionsHandlerFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message: string;
    let extras: Record<string, unknown> | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const body = exceptionResponse as HttpExceptionResponse;
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? exception.message);
      extras = body.extras;
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
}
