import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ApiRequestLog, HttpRequestsType } from '../types/api-request-log.type';

type LoggableRequest = {
  originalUrl?: string;
  url?: string;
  method?: string;
  user?: { sub?: string; email?: string };
};

@Injectable()
export class RequestsLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestsLoggerInterceptor.name);
  private readonly loggerFilePath = path.join(__dirname, '../../../logs/requests.log');
  private loggingDisabled = false;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<LoggableRequest>();
    const startTime = Date.now();

    return next.handle().pipe(tap(() => this.writeLog(request, startTime)));
  }

  private writeLog(request: LoggableRequest, startTime: number): void {
    if (this.loggingDisabled) return;

    try {
      const logDir = path.dirname(this.loggerFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const log: ApiRequestLog = {
        route: request.originalUrl ?? request.url ?? 'unknown route',
        method: (request.method ?? 'GET') as HttpRequestsType,
        userId: request.user?.sub ?? 'unknown user',
        userEmail: request.user?.email ?? 'unknown user',
        timestamp: new Date(),
        requestTime: `${Number(((Date.now() - startTime) / 1000).toFixed(3))} seconds`,
      };

      fs.appendFileSync(this.loggerFilePath, JSON.stringify(log) + '\n');
    } catch (error) {
      this.loggingDisabled = true;
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Request logging disabled: could not write to ${this.loggerFilePath} (${message})`,
      );
    }
  }
}
