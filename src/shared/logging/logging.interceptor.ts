import { CallHandler, ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { tap, type Observable } from 'rxjs';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';
import { RequestContextService } from '@shared/logging/request-context.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private readonly requestContextService: RequestContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithTraceId>();
    const response = httpContext.getResponse<{ statusCode: number }>();
    const startedAt = Date.now();
    const traceId = request.traceId ?? this.requestContextService.getTraceId() ?? 'unknown';
    const path = request.originalUrl ?? request.url;

    this.logger.info(
      {
        context: LoggingInterceptor.name,
        method: request.method,
        path,
      },
      ['[REQUEST]', `Method: ${request.method}`, `Path: ${path}`, `TraceId: ${traceId}`].join('\n'),
    );

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - startedAt;

        this.logger.info(
          {
            context: LoggingInterceptor.name,
            method: request.method,
            path,
            statusCode: response.statusCode,
            elapsedMs,
          },
          [
            '[RESPONSE]',
            `StatusCode: ${response.statusCode}`,
            `ElapsedMs: ${elapsedMs}`,
            `TraceId: ${traceId}`,
          ].join('\n'),
        );
      }),
    );
  }
}
