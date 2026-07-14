export type ApiResponse<T> = {
  success: boolean;
  timestamp: Date;
  statusCode: number;
  data: T;
};
