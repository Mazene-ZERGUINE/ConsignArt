import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseEnvironment } from '../types/app-environment.type';
import { createEnvConfig } from './env.config';
import { UnsupportedDatabaseTypeException } from '../exceptions/unsupported-database-type.exception';
import { UserEntity } from '../../modules/users/entities/user.entity';
import { AdminEntity } from '../../modules/admin/entities/admin.entity';
import { CollectorEntity } from '../../modules/collector/collector.entity';
import { ArtistEntity } from '../../modules/artists/entities/artist.entity';
import { GalleryEntity } from '../../modules/gallery/entities/gallery.entity';
import { RefreshTokensEntity } from '../../modules/auth/entities/refresh-tokens.entity';
import { TransferRequestEntity } from '../../shared/entities/transfer-request.entity';
import { ArtWorkEntity } from '../../modules/works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../../modules/works-of-art/entities/art-work-transfer-history.entity';
import { ContractEntity } from '../../modules/sell-contracts/entities/contract.entity';
import { ReceiptEntity } from '../../modules/sell-contracts/entities/receipt.entity';
import { InvoiceEntity } from '../../modules/sell-contracts/entities/invoice.entity';
import { ExpositionEntity } from '../../modules/expositions/entities/exposition.entity';

export const createTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const env = createEnvConfig(configService);
  const databaseConfig: DatabaseEnvironment = env.database;

  Logger.warn(`App is running using driver: ${databaseConfig.databaseDriver}`, 'TypeOrmConfig');

  Logger.warn(
    `synchronize=${databaseConfig.synchronize} (type ${typeof databaseConfig.synchronize})`,
    'TypeOrmConfig',
  );

  const common = {
    synchronize: databaseConfig.synchronize,
    logging: false,
    entities: [
      UserEntity,
      AdminEntity,
      CollectorEntity,
      ArtistEntity,
      GalleryEntity,
      RefreshTokensEntity,
      TransferRequestEntity,
      ArtWorkEntity,
      ArtWorkTransferHistoryEntity,
      ContractEntity,
      ReceiptEntity,
      InvoiceEntity,
      ExpositionEntity,
    ],
  };

  if (databaseConfig.databaseDriver === 'sqlite') {
    console.log(databaseConfig.database);
    return {
      ...common,
      type: 'better-sqlite3',
      database: databaseConfig.database,
    };
  }

  if (databaseConfig.databaseDriver === 'postgres') {
    return {
      ...common,
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
    };
  }

  throw new UnsupportedDatabaseTypeException(databaseConfig.databaseDriver);
};
