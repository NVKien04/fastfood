import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại', example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Số lượng phần tử trên mỗi trang', example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm theo tên hoặc mô tả', example: 'Pizza' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Trường dùng để sắp xếp (sortOrder, basePrice, createdAt, name, isFeatured)',
    example: 'sortOrder',
  })
  @IsOptional()
  @IsString()
  orderby?: string;

  @ApiPropertyOptional({ description: 'Hướng sắp xếp (ASC hoặc DESC)', example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Lọc theo ID danh mục', example: 1 })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo sản phẩm nổi bật (1: có, 0: không)', example: 1 })
  @IsOptional()
  @IsInt()
  isFeatured?: number;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái hoạt động (1: đang bán, 0: ngưng bán)', example: 1 })
  @IsOptional()
  @IsInt()
  isActive?: number;

  @ApiPropertyOptional({ description: 'Lọc theo giá tối thiểu', example: 50000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Lọc theo giá tối đa', example: 300000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
