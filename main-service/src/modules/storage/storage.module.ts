import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from '@/modules/storage/infrastructure/s3-storage.service';
import { LocalStorageService } from '@/modules/storage/infrastructure/local-storage.service';
import { UploadController } from '@/modules/storage/presentation/controllers/upload.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    S3StorageService,
    LocalStorageService,
    {
      provide: 'IStorageService',
      useExisting: S3StorageService,
    },
  ],
  exports: [S3StorageService, LocalStorageService, 'IStorageService'],
})
export class StorageModule {}
