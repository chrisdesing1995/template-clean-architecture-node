import { RequestMethod } from '@nestjs/common';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Params } from 'nestjs-pino';
import pino, { multistream, stdTimeFunctions, type LoggerOptions } from 'pino';
import pretty from 'pino-pretty';
import { createStream } from 'rotating-file-stream';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';

function normalizeRequestId(value: unknown): string | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return undefined;
}

function resolveLogFileName(time: number | Date | null): string {
  const date = time instanceof Date ? time : time ? new Date(time) : new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `log-${year}${month}${day}.txt`;
}

function createPinoLogger() {
  const logsPath = join(process.cwd(), 'logs');

  mkdirSync(logsPath, { recursive: true });

  const streams: Array<{ stream: NodeJS.WritableStream }> = [
    {
      stream: createStream(resolveLogFileName, {
        path: logsPath,
        interval: '1d',
        intervalBoundary: true,
      }),
    },
  ];

  if ((process.env.NODE_ENV ?? 'development') === 'development') {
    streams.push({
      stream: pretty({
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: false,
        ignore: 'pid,hostname',
      }),
    });
  } else {
    streams.push({
      stream: process.stdout,
    });
  }

  const options: LoggerOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: stdTimeFunctions.isoTime,
    base: undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
  };

  return pino(options, multistream(streams));
}

export function createLoggerModuleConfig(): Params {
  return {
    forRoutes: [
      {
        path: '*path',
        method: RequestMethod.ALL,
      },
    ],
    pinoHttp: {
      logger: createPinoLogger(),
      autoLogging: false,
      genReqId: (request, response) => {
        const httpRequest = request as RequestWithTraceId;
        const requestId =
          httpRequest.requestId ??
          normalizeRequestId(httpRequest.id) ??
          httpRequest.headers['x-request-id']?.toString() ??
          randomUUID();

        httpRequest.requestId = requestId;
        response.setHeader('x-request-id', requestId);

        return requestId;
      },
      customProps: (request) => {
        const httpRequest = request as RequestWithTraceId;
        const requestId = httpRequest.requestId ?? normalizeRequestId(httpRequest.id) ?? 'unknown';

        return {
          traceId: httpRequest.traceId ?? requestId,
          requestId,
        };
      },
    },
  };
}
