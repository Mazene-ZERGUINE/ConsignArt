/**
 * Throws an exception when the env variables are invalid or missing
 */
export class InvalideEnvConfigException extends Error {
  constructor(envErrors: string[]) {
    super(`Invalid environment configuration ${envErrors.join(', ')} are missing or invalid`);
  }
}
