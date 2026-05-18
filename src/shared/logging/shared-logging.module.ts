import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from '@shared/exceptions/global-exception.filter';
import { ApiResponseInterceptor } from '@shared/interceptors/api-response.interceptor';
import { ExecutionService } from '@shared/logging/execution.service';
import { LoggingInterceptor } from '@shared/logging/logging.interceptor';
import { RequestContextService } from '@shared/logging/request-context.service';

@Module({
  providers: [
    RequestContextService,
    ExecutionService,
    LoggingInterceptor,
    ApiResponseInterceptor,
    GlobalExceptionFilter,
  ],
  exports: [
    RequestContextService,
    ExecutionService,
    LoggingInterceptor,
    ApiResponseInterceptor,
    GlobalExceptionFilter,
  ],
})
export class SharedLoggingModule {}
