import { Expose, Transform } from 'class-transformer';

export class ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  data?: T | null;
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  meta?: PaginationMeta | null;
  timestamp: string;
  path: string;
  takenTime: string;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    meta?: PaginationMeta,
  ) {
    this.success = success;
    this.message = message;
    this.data = data || undefined;
    this.meta = meta || undefined;
    this.timestamp = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
    });
    this.path = '';
    this.takenTime = '';
  }
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
