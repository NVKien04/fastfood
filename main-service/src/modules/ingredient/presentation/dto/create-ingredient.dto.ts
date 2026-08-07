import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ description: 'Tên nguyên liệu', example: 'Double Cheese' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Link ảnh nguyên liệu', example: 'https://example.com/cheese.png' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'Mô tả nguyên liệu', example: 'Thêm phô mai lát' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', example: 1, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ description: 'Giá tiền nguyên liệu (VNĐ/đơn vị)', example: 15000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Bắt buộc chọn không? (0: không, 1: có)', example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  isRequired?: number; // 0 | 1

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động (0: ẩn, 1: hiện)', example: 1, default: 1 })
  @IsInt()
  @IsOptional()
  isActive?: number; // 0 | 1

  @ApiProperty({ description: 'Mã ID danh mục chứa nguyên liệu này', example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
