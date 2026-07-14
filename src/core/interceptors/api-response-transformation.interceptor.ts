import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiResponse } from '../types/api-response.type';
import { map, Observable } from 'rxjs';

@Injectable()
export class ApiResponseTransformationInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        timestamp: new Date(),
        statusCode: response.statusCode as number,
        data,
      })),
    );
  }
}
