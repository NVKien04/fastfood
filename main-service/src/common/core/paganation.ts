/**
 * Tham số phân trang thuần - Repository chỉ nhận những giá trị đã validate.
 */
export interface PaginationOptions {
  skip: number;
  take: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Response phân trang chuẩn trả về cho client.
 */
export interface PaginationResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Helper build response phân trang từ dữ liệu thô.
 * Service gọi hàm này sau khi nhận [data, count] từ Repository.
 */
export function buildPaginationResponse<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
): PaginationResponse<T> {
  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
}
