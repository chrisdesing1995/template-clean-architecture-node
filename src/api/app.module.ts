import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersonsModule } from '@api/persons/persons.module';
import { TraceIdMiddleware } from '@shared/middleware/trace-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
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
