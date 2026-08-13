import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from './services/s3-storage.service';

export const STORAGE_SERVICE = 'IStorageService';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    S3StorageService,
    {
      provide: STORAGE_SERVICE,
      useExisting: S3StorageService,
    },
  ],
  exports: [S3StorageService, STORAGE_SERVICE],
})
export class StorageModule {}
