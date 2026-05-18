import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Response } from 'express';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';
import { RequestContextService } from '@shared/logging/request-context.service';

function normalizeRequestId(value: unknown): string | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return undefined;
}

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(request: RequestWithTraceId, response: Response, next: NextFunction): void {
    const requestId =
      request.requestId ??
      normalizeRequestId(request.id) ??
      request.headers['x-request-id']?.toString() ??
      randomUUID();
    const traceId = request.headers['x-trace-id']?.toString() ?? requestId;

    request.requestId = requestId;
    request.traceId = traceId;

    response.setHeader('x-request-id', requestId);
    response.setHeader('x-trace-id', traceId);

    this.requestContextService.run(
      {
        requestId,
        traceId,
        method: request.method,
        path: request.originalUrl ?? request.url,
      },
      next,
    );
  }
}
