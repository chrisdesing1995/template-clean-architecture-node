import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import type { ExecutionInterface } from '@shared/logging/execution.interface';
import { RequestContextService } from '@shared/logging/request-context.service';
import { safeSerialize } from '@shared/logging/safe-serializer.util';

@Injectable()
export class ExecutionService implements ExecutionInterface {
  constructor(
    private readonly logger: PinoLogger,
    private readonly requestContextService: RequestContextService,
  ) {}

  async executeAsync<T>(
    title: string,
    startMessage: string,
    endMessage: string,
    errorMessage: string,
    action: () => Promise<T>,
    request?: unknown,
  ): Promise<T>;

  async executeAsync(
    title: string,
    startMessage: string,
    endMessage: string,
    errorMessage: string,
    action: () => Promise<void>,
    request?: unknown,
  ): Promise<void>;

  async executeAsync<T>(
    title: string,
    startMessage: string,
    endMessage: string,
    errorMessage: string,
    action: () => Promise<T>,
    request?: unknown,
  ): Promise<T> {
    const startedAt = Date.now();
    const traceId = this.requestContextService.getTraceId() ?? 'unknown';
    const serializedRequest = request ? safeSerialize(request) : 'null';

    this.logger.info(
      {
        context: ExecutionService.name,
        title,
        startMessage,
        request: serializedRequest,
      },
      ['[START]', `Title: ${title}`, `TraceId: ${traceId}`, `Request: ${serializedRequest}`].join(
        '\n',
      ),
    );

    try {
      const result = await action();
      const elapsedMs = Date.now() - startedAt;
      const serializedResponse = safeSerialize(result);

      this.logger.info(
        {
          context: ExecutionService.name,
          title,
          endMessage,
          elapsedMs,
          response: serializedResponse,
        },
        [
          '[END]',
          `Title: ${title}`,
          `ElapsedMs: ${elapsedMs}`,
          `Response: ${serializedResponse}`,
        ].join('\n'),
      );

      return result;
    } catch (error) {
      const elapsedMs = Date.now() - startedAt;
      const serializedError = safeSerialize(error);

      this.logger.error(
        {
          context: ExecutionService.name,
          title,
          errorMessage,
          elapsedMs,
          exception: serializedError,
        },
        [
          '[ERROR]',
          `Title: ${title}`,
          `ElapsedMs: ${elapsedMs}`,
          `Exception: ${serializedError}`,
        ].join('\n'),
      );

      throw error;
    }
  }
}
