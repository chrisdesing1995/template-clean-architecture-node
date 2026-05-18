import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Template Clean Architecture Node API')
    .setDescription(
      'Enterprise reusable NestJS template with standard responses, validation, traceability and modular growth.',
    )
    .setVersion('1.0.0');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
}
