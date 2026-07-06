import { Global, Module } from '@nestjs/common';
import { CryptoUtilsService } from './service/crypto-utils.service';

@Global()
@Module({
  providers: [CryptoUtilsService],
  exports: [CryptoUtilsService],
})
export class SharedModule {}
