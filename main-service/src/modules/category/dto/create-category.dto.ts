import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên danh mục', example: 'Pizza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Slug của danh mục', example: 'pizza' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả danh mục', example: 'Các loại pizza ngon nhất' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Thứ tự sắp xếp', example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  isActive?: number;
}
