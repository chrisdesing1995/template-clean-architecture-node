import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from '@api/app.module';
import { GlobalExceptionFilter } from '@shared/exceptions/global-exception.filter';
import { LoggingInterceptor } from '@shared/logging/logging.interceptor';
import { setupSwagger } from '@shared/swagger/swagger.config';
import { ApiResponseInterceptor } from '@shared/interceptors/api-response.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(app.get(LoggingInterceptor), app.get(ApiResponseInterceptor));
  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  logger.log(`Project root path: ${process.cwd()}`);
  logger.log(`Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`Swagger is running on: http://localhost:${port}/swagger`);
}

void bootstrap();
