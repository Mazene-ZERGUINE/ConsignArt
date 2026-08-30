import type { AuthTokens } from '../types/api';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api/v1';
const TOKENS_KEY = 'consignart.tokens';

export function getTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKENS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

export function setTokens(tokens: AuthTokens | null): void {
  if (tokens) localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  else localStorage.removeItem(TOKENS_KEY);
}

export class ApiError extends Error {
  status: number;
  extras?: unknown;

  constructor(status: number, message: string, extras?: unknown) {
    super(message);
    this.status = status;
    this.extras = extras;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  useRefreshToken?: boolean;
};

type Envelope<T> = { success: boolean; data?: T; message?: string; extras?: unknown };

async function rawRequest<T>(path: string, options: RequestOptions = {}, allowRetry = true): Promise<T> {
  const { method = 'GET', body, auth = true, useRefreshToken = false } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const tokens = getTokens();
  if (auth && tokens) {
    headers.Authorization = `Bearer ${useRefreshToken ? tokens.refreshToken : tokens.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const json = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok) {
    if (response.status === 401 && auth && !useRefreshToken && allowRetry && tokens) {
      const refreshed = await tryRefreshTokens();
      if (refreshed) return rawRequest<T>(path, options, false);
    }
    throw new ApiError(response.status, json?.message ?? 'Request failed', json?.extras);
  }

  return (json?.data as T) ?? (undefined as T);
}

async function tryRefreshTokens(): Promise<boolean> {
  try {
    const result = await rawRequest<{ token: AuthTokens }>(
      '/auth/refresh-token',
      { method: 'POST', useRefreshToken: true },
      false,
    );
    setTokens(result.token);
    return true;
  } catch {
    setTokens(null);
    return false;
  }
}

export const api = {
  get: <T>(path: string) => rawRequest<T>(path),
  post: <T>(path: string, body?: unknown) => rawRequest<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => rawRequest<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => rawRequest<T>(path, { method: 'DELETE' }),
  publicPost: <T>(path: string, body?: unknown) => rawRequest<T>(path, { method: 'POST', body, auth: false }),
};
