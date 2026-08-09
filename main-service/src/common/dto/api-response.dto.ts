import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Tổng số phần tử' })
  totalItems: number;

  @ApiProperty({ example: 10, description: 'Số lượng phần tử trên trang hiện tại' })
  itemCount: number;

  @ApiProperty({ example: 10, description: 'Số phần tử hiển thị tối đa trên 1 trang' })
  itemsPerPage: number;

  @ApiProperty({ example: 10, description: 'Tổng số trang' })
  totalPages: number;

  @ApiProperty({ example: 1, description: 'Trang hiện tại' })
  currentPage: number;
}

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true, description: 'Trạng thái thành công' })
  success: boolean = true;

  data?: T | null;

  @ApiPropertyOptional({ type: PaginationMetaDto, description: 'Thông tin phân trang (nếu có)' })
  meta?: PaginationMetaDto;

  @ApiProperty({ example: '2026-08-09T00:00:00.000Z', description: 'Thời gian phản hồi' })
  timestamp: string;

  @ApiProperty({ example: '/api/users/profile', description: 'Đường dẫn API request' })
  path: string;

  @ApiProperty({ example: '15ms', description: 'Thời gian thực thi' })
  takenTime: string;

  constructor(data?: T, meta?: PaginationMetaDto) {
    this.data = data ?? undefined;
    if (meta) {
      this.meta = meta;
    }
    this.timestamp = new Date().toISOString();
    this.path = '';
    this.takenTime = '';
  }
}
