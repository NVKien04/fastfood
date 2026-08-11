export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface BackendResponse<T> {
  success: boolean;
  data?: T | null;
  meta?: PaginationMeta;
  timestamp?: string;
  path?: string;
  takenTime?: string;
  message?: string;
}

export type BaseResponse<T> =
  | { kind: 'OK'; data: T; pagination?: PaginationMeta }
  | { kind: 'ERROR'; data: null; error?: string; status?: number };
