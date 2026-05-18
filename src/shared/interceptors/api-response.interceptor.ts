import { CallHandler, ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';
import type { ApiResponse } from '@shared/responses/api-response.interface';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithTraceId>();
    const response = httpContext.getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map((data) => {
        if (this.isApiResponse(data)) {
          return data;
        }

        return {
          traceId: request.traceId ?? 'unknown',
          success: true,
          code: response.statusCode,
          message: 'Operation successful.',
          data: data ?? null,
          errors: null,
        };
      }),
    );
  }

  private isApiResponse(value: unknown): value is ApiResponse<T> {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return (
      'traceId' in value &&
      'success' in value &&
      'code' in value &&
      'message' in value &&
      'data' in value &&
      'errors' in value
    );
  }
}
