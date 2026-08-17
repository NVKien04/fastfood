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
  bucket?: string;
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
  /**
   * Upload file trực tiếp lên Storage
   */
  uploadFile(file: StorageFile, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Xóa file khỏi Storage bằng key hoặc URL
   */
  deleteFile(fileUrlOrKey: string): Promise<boolean>;

  /**
   * Tạo Presigned URL cho client upload trực tiếp
   */
  getPresignedUploadUrl(options: PresignedUploadUrlOptions): Promise<PresignedUploadUrlResult>;

  /**
   * Lấy URL công khai của file theo key
   */
  getPublicUrl(key: string): Promise<string>;

  /**
   * Trích xuất storage key từ URL đầy đủ
   */
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
