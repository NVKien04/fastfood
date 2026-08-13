export interface StorageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size?: number;
}

export interface UploadOptions {
  folder?: string;
  customFilename?: string;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  mimetype: string;
  size?: number;
}

export interface PresignedUploadUrlOptions {
  filename: string;
  mimetype: string;
  folder?: string;
  expiresInSeconds?: number;
}

export interface PresignedUploadUrlResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface IStorageService {
  uploadFile(file: StorageFile, options?: UploadOptions): Promise<UploadResult>;
  deleteFile(fileUrlOrKey: string): Promise<boolean>;
  getPresignedUploadUrl(options: PresignedUploadUrlOptions): Promise<PresignedUploadUrlResult>;
  getPublicUrl(key: string): Promise<string>;
  extractKeyFromUrl(fileUrlOrKey: string): string;
}

export const DEFAULT_ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
