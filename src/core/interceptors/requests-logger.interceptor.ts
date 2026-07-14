import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ApiRequestLog, HttpRequestsType } from '../types/api-request-log.type';

@Injectable()
export class RequestsLoggerInterceptor implements NestInterceptor {
  private readonly loggerFilePath = path.join(__dirname, '../../../logs/requests.log');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    const logDir = path.dirname(this.loggerFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    return next.handle().pipe(
      tap(() => {
        const log: ApiRequestLog = {
          route: (request.originalUrl ?? request.url) as string,
          method: request.method as HttpRequestsType,
          userId: (request.user?.sub as string) ?? 'unknown user',
          userEmail: (request.user?.email as string) ?? 'unknown user',
          timestamp: new Date(),
          requestTime: `${Number(((Date.now() - startTime) / 1000).toFixed(3))} seconds`,
        };

        fs.appendFileSync(this.loggerFilePath, JSON.stringify(log) + '\n');
      }),
    );
  }
}
