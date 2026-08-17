import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  IStorageService,
  StorageFile,
  UploadOptions,
  UploadResult,
  PresignedUploadUrlOptions,
  PresignedUploadUrlResult,
  DEFAULT_ALLOWED_IMAGE_TYPES,
  DEFAULT_MAX_FILE_SIZE_BYTES,
} from '@/modules/storage/domain/interface/storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService, OnModuleInit {
  private readonly logger = new Logger(LocalStorageService.name);
  private uploadDir: string;
  private appUrl: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.uploadDir = this.configService.get<string>('LOCAL_STORAGE_DIR', path.join(process.cwd(), 'uploads'));
    this.appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');

    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Failed to create local uploads directory: ${message}`);
    }
  }

  /**
   * Upload file vào thư mục cục bộ
   */
  async uploadFile(file: StorageFile, options: UploadOptions = {}): Promise<UploadResult> {
    const {
      folder = 'uploads',
      customFilename,
      allowedMimeTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
      maxSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
    } = options;

    this.validateFile(file, allowedMimeTypes, maxSizeBytes);

    const fileExtension = path.extname(file.originalname) || this.getExtensionFromMimetype(file.mimetype);
    const fileName = customFilename
      ? `${customFilename}${fileExtension}`
      : `${Date.now()}-${randomUUID()}${fileExtension}`;

    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const relativeKey = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;
    const targetFolder = cleanFolder ? path.join(this.uploadDir, cleanFolder) : this.uploadDir;
    const targetFilePath = path.join(this.uploadDir, relativeKey);

    try {
      await fs.mkdir(targetFolder, { recursive: true });
      await fs.writeFile(targetFilePath, file.buffer);

      const url = `${this.appUrl.replace(/\/+$/, '')}/${relativeKey}`;

      this.logger.log(`✅ File saved locally: ${relativeKey}`);

      return {
        key: relativeKey,
        url,
        mimetype: file.mimetype,
        size: file.buffer.length,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Failed to save file locally: ${message}`, error);
      throw new BusinessException(ErrorEnum.FILE_UPLOAD_FAILED);
    }
  }

  /**
   * Xóa file khỏi ổ đĩa cục bộ
   */
  async deleteFile(fileUrlOrKey: string): Promise<boolean> {
    if (!fileUrlOrKey) return false;

    const key = this.extractKeyFromUrl(fileUrlOrKey);
    if (!key) return false;

    const filePath = path.join(this.uploadDir, key);

    try {
      await fs.unlink(filePath);
      this.logger.log(`🗑️ Deleted local file: ${key}`);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`⚠️ Failed to delete local file (${key}): ${message}`);
      return false;
    }
  }

  /**
   * Presigned URL không hỗ trợ trực tiếp trên local disk, fallback trả về đường dẫn upload của app
   */
  getPresignedUploadUrl(options: PresignedUploadUrlOptions): Promise<PresignedUploadUrlResult> {
    const { filename, mimetype, folder = 'uploads', expiresInSeconds = 900 } = options;
    const fileExtension = path.extname(filename) || this.getExtensionFromMimetype(mimetype);
    const uniqueFileName = `${Date.now()}-${randomUUID()}${fileExtension}`;
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const key = cleanFolder ? `${cleanFolder}/${uniqueFileName}` : uniqueFileName;
    const publicUrl = `${this.appUrl.replace(/\/+$/, '')}/${key}`;

    return Promise.resolve({
      uploadUrl: publicUrl,
      key,
      publicUrl,
      expiresInSeconds,
    });
  }

  /**
   * Lấy URL công khai
   */
  getPublicUrl(key: string): Promise<string> {
    return Promise.resolve(`${this.appUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`);
  }

  /**
   * Trích xuất key từ URL hoặc key thô
   */
  extractKeyFromUrl(fileUrlOrKey: string): string {
    if (!fileUrlOrKey) return '';
    if (!fileUrlOrKey.startsWith('http://') && !fileUrlOrKey.startsWith('https://')) {
      return fileUrlOrKey.replace(/^\/+/, '');
    }

    try {
      const parsedUrl = new URL(fileUrlOrKey);
      return parsedUrl.pathname.replace(/^\/+/, '');
    } catch {
      return fileUrlOrKey;
    }
  }

  private validateFile(file: StorageFile, allowedMimeTypes: string[], maxSizeBytes: number): void {
    if (!file || !file.buffer) {
      throw new BusinessException(ErrorEnum.VALIDATION_ERROR);
    }

    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
      throw new BusinessException(ErrorEnum.INVALID_FILE_TYPE);
    }

    if (file.buffer.length > maxSizeBytes) {
      throw new BusinessException(ErrorEnum.FILE_TOO_LARGE);
    }
  }

  private getExtensionFromMimetype(mimetype: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
    };
    return map[mimetype] || '';
  }
}
