import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@api/app.module';
import { GlobalExceptionFilter } from '@shared/exceptions/global-exception.filter';
import { ApiResponseInterceptor } from '@shared/interceptors/api-response.interceptor';
import { setupSwagger } from '@shared/swagger/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
}

void bootstrap();
