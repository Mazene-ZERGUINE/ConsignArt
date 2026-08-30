import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwaggerConfig } from './core/config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { createEnvConfig } from './core/config/env.config';
import { Logger } from '@nestjs/common';
import { GlobalExceptionsHandlerFilter } from './core/filter/global-exception-handler.filter';
import { createDtoValidationPipe } from './core/pipes/dto-validation-options.pipe';
import cookieParser from 'cookie-parser';
import { ApiResponseTransformationInterceptor } from './core/interceptors/api-response-transformation.interceptor';
import { RequestsLoggerInterceptor } from './core/interceptors/requests-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');
  app.use(cookieParser());
  app.enableCors({ origin: true });

  const configService = app.get(ConfigService);
  const env = createEnvConfig(configService);

  app.useGlobalFilters(new GlobalExceptionsHandlerFilter());
  app.useGlobalPipes(createDtoValidationPipe());

  app.useGlobalInterceptors(
    new ApiResponseTransformationInterceptor(),
    new RequestsLoggerInterceptor(),
  );

  createSwaggerConfig(app);

  await app.listen(env.server.port ?? 3000);
  Logger.warn(`Server is running on ${env.NodeEnv} mode !!`);
  Logger.log(`Server running on host: ${env.server.host} port ${env.server.port}`);
}
bootstrap().catch((err) => console.error('Server failed to start', err));
