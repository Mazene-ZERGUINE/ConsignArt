export type HttpRequestsType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export type ApiRequestLog = {
  route: string;
  method: HttpRequestsType;
  userId: string;
  userEmail: string;
  timestamp: Date;
  requestTime: string;
};
