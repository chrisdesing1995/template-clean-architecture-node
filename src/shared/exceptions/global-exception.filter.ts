import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import type { Response } from 'express';
import type { RequestWithTraceId } from '@shared/http/request-with-trace-id.interface';
import { RequestContextService } from '@shared/logging/request-context.service';
import { safeSerialize } from '@shared/logging/safe-serializer.util';
import type { ApiError } from '@shared/responses/api-error.interface';
import type { ApiResponse } from '@shared/responses/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: PinoLogger,
    private readonly requestContextService: RequestContextService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<RequestWithTraceId>();
    const traceId = request.traceId ?? this.requestContextService.getTraceId() ?? 'unknown';

    const status = this.getStatus(exception);
    const body = this.buildErrorResponse(status, exception, traceId);

    this.logger.error(
      {
        context: GlobalExceptionFilter.name,
        method: request.method,
        path: request.originalUrl ?? request.url,
        statusCode: status,
        exception: safeSerialize(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
      },
      [
        '[EXCEPTION]',
        `Method: ${request.method}`,
        `Path: ${request.originalUrl ?? request.url}`,
        `TraceId: ${traceId}`,
      ].join('\n'),
    );

    response.status(status).json(body);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildErrorResponse(
    status: number,
    exception: unknown,
    traceId: string,
  ): ApiResponse<null> {
    const errors = this.extractErrors(exception);

    return {
      traceId,
      success: false,
      code: status,
      message: this.resolveMessage(status, exception),
      data: null,
      errors,
    };
  }

  private resolveMessage(status: number, exception: unknown): string {
    if (status >= 500) {
      return 'Technical error.';
    }

    if (exception instanceof BadRequestException) {
      return 'Technical error.';
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return exceptionResponse;
      }

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        typeof exceptionResponse.message === 'string'
      ) {
        return exceptionResponse.message;
      }

      return exception.message;
    }

    return 'Technical error.';
  }

  private extractErrors(exception: unknown): ApiError[] | null {
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        Array.isArray(exceptionResponse.message)
      ) {
        return exceptionResponse.message.map((message) => ({
          code: 'VALIDATION_ERROR',
          message: String(message),
        }));
      }
    }

    if (exception instanceof HttpException) {
      return [
        {
          code: exception.name.toUpperCase(),
          message: exception.message,
        },
      ];
    }

    return [
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
    ];
  }
}
