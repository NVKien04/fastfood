import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';
import {
  IStorageService,
  StorageFile,
  UploadOptions,
  UploadResult,
  PresignedUploadUrlOptions,
  PresignedUploadUrlResult,
  DEFAULT_ALLOWED_IMAGE_TYPES,
  DEFAULT_MAX_FILE_SIZE_BYTES,
} from '@/common/constants/storage.constant';

@Injectable()
export class S3StorageService implements IStorageService, OnModuleInit {
  private readonly logger = new Logger(S3StorageService.name);
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private customPublicUrl?: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.region = this.configService.get<string>('AWS_REGION', 'ap-southeast-1');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET', '');
    this.customPublicUrl = this.configService.get<string>('AWS_S3_PUBLIC_URL');

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID', '');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY', '');
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');

    this.s3Client = new S3Client({
      region: this.region,
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    });

    if (!this.bucket) {
      this.logger.warn('⚠️ AWS_S3_BUCKET is not configured in environment variables.');
    }
  }

  /**
   * Upload file/image buffer to AWS S3.
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
    const key = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000',
      });

      await this.s3Client.send(command);

      const url = this.buildPublicUrl(key);

      this.logger.log(`✅ File uploaded successfully to S3: ${key}`);

      return {
        key,
        url,
        bucket: this.bucket,
        mimetype: file.mimetype,
        size: file.buffer.length,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown S3 error';
      this.logger.error(`❌ Failed to upload file to S3: ${errorMessage}`, error);
      throw new BusinessException(ErrorEnum.FILE_UPLOAD_FAILED);
    }
  }

  /**
   * Delete file from AWS S3 using URL or key.
   */
  async deleteFile(fileUrlOrKey: string): Promise<boolean> {
    if (!fileUrlOrKey) return false;

    const key = this.extractKeyFromUrl(fileUrlOrKey);
    if (!key) return false;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`🗑️ Deleted file from S3: ${key}`);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to delete file from S3 (${key}): ${errorMessage}`, error);
      return false;
    }
  }

  /**
   * Generate Presigned Upload URL for direct client-side S3 upload.
   */
  async getPresignedUploadUrl(options: PresignedUploadUrlOptions): Promise<PresignedUploadUrlResult> {
    const { filename, mimetype, folder = 'uploads', expiresInSeconds = 900 } = options;

    const fileExtension = path.extname(filename) || this.getExtensionFromMimetype(mimetype);
    const uniqueFileName = `${Date.now()}-${randomUUID()}${fileExtension}`;
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const key = cleanFolder ? `${cleanFolder}/${uniqueFileName}` : uniqueFileName;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: mimetype,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      const publicUrl = this.buildPublicUrl(key);

      return {
        uploadUrl,
        key,
        publicUrl,
        expiresInSeconds,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to generate presigned upload URL: ${errorMessage}`, error);
      throw new BusinessException(ErrorEnum.FILE_UPLOAD_FAILED);
    }
  }

  /**
   * Get full public URL for a given S3 key.
   */
  async getPublicUrl(key: string): Promise<string> {
    return this.buildPublicUrl(key);
  }

  /**
   * Extract S3 key from full S3 URL or custom CDN URL.
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

  private buildPublicUrl(key: string): string {
    if (this.customPublicUrl) {
      const cleanCdn = this.customPublicUrl.replace(/\/+$/, '');
      return `${cleanCdn}/${key}`;
    }
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    if (endpoint) {
      const cleanEndpoint = endpoint.replace(/\/+$/, '');
      return `${cleanEndpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
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
