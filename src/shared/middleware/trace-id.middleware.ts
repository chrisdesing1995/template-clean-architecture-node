import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Response } from 'express';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(request: RequestWithTraceId, response: Response, next: NextFunction): void {
    const traceId = request.headers['x-trace-id']?.toString() ?? randomUUID();

    request.traceId = traceId;
    response.setHeader('x-trace-id', traceId);

    next();
  }
}
