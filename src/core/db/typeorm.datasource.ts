import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createTypeOrmConfig } from '../config/typeorm.config';
import { config as loadEnv } from 'dotenv';

loadEnv();
const configService = new ConfigService();

const options = createTypeOrmConfig(configService) as DataSourceOptions;

const dataSource = new DataSource({
  ...options,
  synchronize: false,
  migrations: ['src/core/db/migrations/*.ts'],
});

export default dataSource;
