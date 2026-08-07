import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID danh mục', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên danh mục', example: 'Pizza' })
  name: string;

  @ApiProperty({ description: 'Slug của danh mục', example: 'pizza' })
  slug: string;

  @ApiProperty({ description: 'Mô tả danh mục', example: 'Các loại pizza ngon nhất', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Thứ tự sắp xếp', example: 1 })
  sortOrder: number;

  @ApiProperty({ description: 'Trạng thái hoạt động (1: Hoạt động, 0: Khóa)', example: 1 })
  isActive: number;

  @ApiProperty({ description: 'Ngày tạo', example: '2026-08-07T16:09:54.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật', example: '2026-08-07T16:09:54.000Z' })
  updatedAt: Date;
}
