export type HttpExceptionResponse = {
  message?: string | string[];
  extras?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  code: number;
  message: string;
  extras?: Record<string, unknown>;
};

export type FormattedValidationError = {
  field: string;
  errors: string[];
  children?: FormattedValidationError[];
};
