import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Trường dùng để sắp xếp', example: 'sortOrder' })
  @IsOptional()
  @IsString()
  orderby?: string;

  @ApiPropertyOptional({ description: 'Hướng sắp xếp (ASC hoặc DESC)', example: 'ASC' })
  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Lọc theo ID danh mục', example: 1 })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo sản phẩm nổi bật (1: có, 0: không)', example: 1 })
  @IsOptional()
  @IsInt()
  isFeatured?: number;
}
