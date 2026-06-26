import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppEnvironmentType } from '../types/app-environment.type';
import { InvalideEnvConfigException } from '../exceptions/invalide-env-config.exception';
import { EnvValidation } from './env.validation';

export type EnvTypes = 'development' | 'production';
export type DbDriversTypes = 'postgres' | 'sqlite';

// the node env variable is set on the npm run dev commande called on module level
export function getEnvFilePath(): string {
  const env: EnvTypes = (process.env.NODE_ENV as EnvTypes) ?? 'development';
  return env === 'development' ? '.env.local' : '.env.production';
}

/**
 * Validate the env variables using a class-validator class.
 *
 * Throws InvalideEnvConfigException on failure, mismatch, or missing mandatory vars.
 */
function validateEnv(env: Record<string, unknown>): EnvValidation {
  const validated = plainToInstance(EnvValidation, env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
  });

  if (errors.length > 0) {
    const messages = errors.map((err) => {
      const constraints = err.constraints ? Object.values(err.constraints).join('; ') : 'invalid';
      return `${err.property} (${constraints})`;
    });
    throw new InvalideEnvConfigException(messages);
  }

  return validated;
}

/**
 * Factory function, reads raw env variables loaded from ConfigService, apply class-validator validation, and,
 *
 * then maps to  AppEnvironmentType.
 */
export const createEnvConfig = (configService: ConfigService): AppEnvironmentType => {
  const rawEnvData = {
    NODE_ENV: configService.get<string>('NODE_ENV'),
    SERVER_PORT: configService.get<string>('SERVER_PORT'),
    SERVER_HOST: configService.get<string>('SERVER_HOST'),
    SERVER_DEBUG_MODE: configService.get<string>('SERVER_DEBUG_MODE'),
    DB_DRIVER: configService.get<string>('DB_DRIVER'),
    DB_HOST: configService.get<string>('DB_HOST'),
    DB_PORT: configService.get<string>('DB_PORT'),
    DB_USERNAME: configService.get<string>('DB_USERNAME'),
    DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
    DB_DATABASE: configService.get<string>('DB_DATABASE'),
    DB_SYNCHRONIZE: configService.get<string>('DB_SYNCHRONIZE'),
    DB_DEBUG_MODE: configService.get<string>('DB_DEBUG_MODE'),
  };

  const validated = validateEnv(rawEnvData);

  return {
    NodeEnv: validated.NODE_ENV,
    server: {
      port: validated.SERVER_PORT,
      host: validated.SERVER_HOST,
      debugMode: validated.SERVER_DEBUG_MODE,
    },
    database: {
      databaseDriver: validated.DB_DRIVER,
      host: validated.DB_HOST,
      port: validated.DB_PORT,
      username: validated.DB_USERNAME,
      password: validated.DB_PASSWORD,
      database: validated.DB_DATABASE,
      synchronize: validated.DB_SYNCHRONIZE,
      debugMode: validated.DB_DEBUG_MODE,
    },
  };
};
