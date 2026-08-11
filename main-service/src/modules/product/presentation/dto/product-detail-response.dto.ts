import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SizeEnum } from '#src/enums/size.enum';
import { TypeEnum } from '#src/enums/type.enum';

// ──────────────────────────────────────────────────────────────────────────────
// Variant Response
// ──────────────────────────────────────────────────────────────────────────────

export class ProductVariantResponseDto {
  @ApiProperty({ description: 'ID biến thể (auto-increment)', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên biến thể', example: 'Nhỏ - Mỏng' })
  name: string;

  @ApiProperty({ description: 'Kích thước', enum: SizeEnum, example: SizeEnum.SIZE_12 })
  size: SizeEnum;

  @ApiProperty({ description: 'Loại đế/vỏ', enum: TypeEnum, example: TypeEnum.MEDIUM })
  type: TypeEnum;

  @ApiProperty({ description: 'Giá chênh lệch so với giá gốc (VND)', example: 5000 })
  modifiedPrice: number;

  @ApiProperty({ description: 'Thứ tự hiển thị', example: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Trạng thái kích hoạt (1: hoạt động, 0: tắt)', example: 1 })
  isActive: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Ingredient Response (Nguyên liệu theo danh mục của sản phẩm)
// ──────────────────────────────────────────────────────────────────────────────

export class ProductIngredientResponseDto {
  @ApiProperty({ description: 'ID nguyên liệu', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên nguyên liệu', example: 'Phô mai Mozzarella' })
  name: string;

  @ApiProperty({ description: 'URL ảnh nguyên liệu', example: 'https://cdn.example.com/cheese.jpg' })
  imageUrl: string;

  @ApiProperty({ description: 'Mô tả nguyên liệu', example: 'Phô mai béo ngậy' })
  description: string;

  @ApiProperty({ description: 'Giá mua thêm nguyên liệu (VND)', example: 10000 })
  price: number;

  @ApiProperty({ description: 'Bắt buộc phải có (1: có, 0: không)', example: 1 })
  isRequired: number;

  @ApiProperty({ description: 'Trạng thái kích hoạt (1: hoạt động, 0: tắt)', example: 1 })
  isActive: number;

  @ApiProperty({ description: 'ID danh mục', example: 2 })
  categoryId: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Product Detail Response
// ──────────────────────────────────────────────────────────────────────────────

export class ProductDetailResponseDto {
  @ApiProperty({ description: 'ID sản phẩm (UUID)', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ description: 'Tên sản phẩm', example: 'Pizza Hải Sản' })
  name: string;

  @ApiProperty({ description: 'Slug SEO-friendly', example: 'pizza-hai-san' })
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả sản phẩm', example: 'Pizza phủ hải sản tươi ngon' })
  description?: string;

  @ApiProperty({ description: 'Giá gốc (VND)', example: 180000 })
  basePrice: number;

  @ApiProperty({ description: 'Thứ tự hiển thị', example: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'URL hình ảnh sản phẩm', example: 'https://cdn.example.com/pizza.jpg' })
  img: string;

  @ApiProperty({ description: 'Sản phẩm nổi bật (1: có, 0: không)', example: 1 })
  isFeatured: number;

  @ApiProperty({ description: 'ID danh mục', example: 2 })
  categoryId: number;

  @ApiProperty({ description: 'Trạng thái kích hoạt (1: hoạt động, 0: tắt)', example: 1 })
  isActive: number;

  @ApiProperty({ description: 'Danh sách biến thể của sản phẩm', type: [ProductVariantResponseDto] })
  variants: ProductVariantResponseDto[];

  @ApiProperty({
    description: 'Danh sách nguyên liệu/topping thuộc danh mục sản phẩm',
    type: [ProductIngredientResponseDto],
  })
  ingredients: ProductIngredientResponseDto[];

  @ApiProperty({ description: 'Thời điểm tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Thời điểm cập nhật lần cuối' })
  updatedAt: Date;
}
