import type { ApiError } from '@shared/responses/api-error.interface';

export interface ApiResponse<T> {
  traceId: string;
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
}
