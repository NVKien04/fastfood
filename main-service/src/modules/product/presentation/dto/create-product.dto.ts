import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { SizeEnum, TypeEnum } from '@/enums';

// ──────────────────────────────────────────────────────────────────────────────
// Sub-DTOs
// ──────────────────────────────────────────────────────────────────────────────

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Tên biến thể', example: 'Nhỏ - Mỏng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Kích thước', enum: SizeEnum, example: SizeEnum.SIZE_20 })
  @IsEnum(SizeEnum)
  size: SizeEnum;

  @ApiProperty({ description: 'Loại đế/vỏ', enum: TypeEnum, example: TypeEnum.MEDIUM })
  @IsEnum(TypeEnum)
  type: TypeEnum;

  @ApiPropertyOptional({ description: 'Giá chênh lệch so với giá gốc (VND)', example: 5000, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  modifiedPrice?: number;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Main DTOs
// ──────────────────────────────────────────────────────────────────────────────

export class CreateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm', example: 'Pizza Hải Sản' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết sản phẩm', example: 'Pizza phủ hải sản tươi ngon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Giá cơ bản (VND)', example: 180000 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ description: 'URL hình ảnh sản phẩm', example: 'https://cdn.example.com/pizza.jpg' })
  @IsNotEmpty()
  @IsString()
  img: string;

  @ApiPropertyOptional({ description: 'Sản phẩm nổi bật (1: có, 0: không)', example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  isFeatured?: number;

  @ApiProperty({ description: 'ID danh mục', example: 1 })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiPropertyOptional({ description: 'Danh sách biến thể kèm theo', type: [CreateProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
