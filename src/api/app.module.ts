import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PersonsModule } from '@api/persons/persons.module';
import { createLoggerModuleConfig } from '@shared/logging/logger.config';
import { SharedLoggingModule } from '@shared/logging/shared-logging.module';
import { TraceIdMiddleware } from '@shared/middleware/trace-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    LoggerModule.forRootAsync({
      inject: [],
      useFactory: () => createLoggerModuleConfig(),
    }),
    SharedLoggingModule,
    PersonsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceIdMiddleware).forRoutes({
      path: '*path',
      method: RequestMethod.ALL,
    });
  }
}
