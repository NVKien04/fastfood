import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { StorageModule } from '@/common/storage';

@Module({
  imports: [StorageModule],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
