import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';
import { type JwtPayload } from '../types/jwt-payload.types';

type CacheEntry = { expiresAt: number; value: unknown };

/**
 * Cache interceptor for read-only consultation endpoints (e.g. the art work catalog).
 * Cache keys include the requester's id: every list endpoint in this app is scoped by
 * role/ownership rather than truly public, so caching by URL alone would leak one
 * user's response to another.
 */
@Injectable()
export class ResponseCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs = 15_000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    if (request.method !== 'GET') return next.handle();

    const key = `${request.user?.sub ?? 'anonymous'}:${request.originalUrl ?? request.url}`;
    const cached = this.cache.get(key);
    if (cached) {
      if (cached.expiresAt > Date.now()) return of(cached.value);
      this.cache.delete(key);
    }

    return next.handle().pipe(
      tap((value) => {
        this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
      }),
    );
  }
}
