import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../types/api-response.type';
import { map, Observable } from 'rxjs';

/**
 * Transformation interceptor: wraps every successful response in a standard
 * envelope { data, meta, timestamp }.
 */
@Injectable()
export class ApiResponseTransformationInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          statusCode: response.statusCode,
          path: request.originalUrl ?? request.url,
        },
        timestamp: new Date(),
      })),
    );
  }
}
