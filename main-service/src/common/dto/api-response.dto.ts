/**
 * DTO chuẩn cho mọi response thành công.
 *
 * Format:
 *   { success: true, data: { ... } }
 *
 * Pagination bổ sung field `meta`:
 *   { success: true, data: [...], meta: { totalItems, ... } }
 */
export class ApiResponseDto<T = any> {
  success: boolean = true;
  data?: T | null;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
  takenTime: string;

  constructor(data?: T, meta?: PaginationMeta) {
    this.data = data ?? undefined;
    if (meta) {
      this.meta = meta;
    }
    this.timestamp = new Date().toISOString();
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
