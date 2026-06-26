export type AppEnvironmentType = {
  NodeEnv: 'development' | 'production';
  server: ServerEnvironment;
  database: DatabaseEnvironment;
};

export type ServerEnvironment = {
  port: number;
  host: string;
  debugMode: boolean;
};

export type DatabaseEnvironment = {
  databaseDriver: 'postgres' | 'sqlite';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  debugMode: boolean;
};
