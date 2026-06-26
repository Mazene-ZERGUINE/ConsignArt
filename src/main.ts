import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwaggerConfig } from './core/config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { createEnvConfig } from './core/config/env.config';
import { Logger } from '@nestjs/common';
import { GlobalExceptionsHandlerFilter } from './core/filter/global-exception-handler.filter';
import { createDtoValidationPipe } from './core/pipes/dto-validation-options.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');

  const configService = app.get(ConfigService);
  const env = createEnvConfig(configService);

  app.useGlobalFilters(new GlobalExceptionsHandlerFilter());
  app.useGlobalPipes(createDtoValidationPipe());

  createSwaggerConfig(app);

  await app.listen(env.server.port ?? 3000);
  Logger.warn(`Server is running on ${env.NodeEnv} mode !!`);
  Logger.log(`Server running on host: ${env.server.host} port ${env.server.port}`);
}
bootstrap().catch((err) => console.error('Server failed to start', err));
