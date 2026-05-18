import type { Request } from 'express';

export interface RequestWithTraceId extends Request {
  requestId?: string;
  traceId?: string;
}
