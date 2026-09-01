export type ApiResponseMeta = {
  statusCode: number;
  path: string;
};

export type ApiResponse<T> = {
  data: T;
  meta: ApiResponseMeta;
  timestamp: Date;
};
