import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';

export class AddToCartIngredientDto {
  @ApiProperty({ description: 'ID nguyên liệu / topping', example: 1 })
  @IsInt()
  @IsNotEmpty()
  ingredientId: number;

  @ApiPropertyOptional({ description: 'Số lượng nguyên liệu', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}

export class AddToCartDto {
  @ApiProperty({ description: 'ID sản phẩm (UUID)', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'ID biến thể sản phẩm (size/đế)', example: 2 })
  @IsInt()
  @IsOptional()
  productVariantId?: number;

  @ApiPropertyOptional({
    description: 'Danh sách nguyên liệu / topping chọn thêm',
    type: [AddToCartIngredientDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddToCartIngredientDto)
  @IsOptional()
  ingredients?: AddToCartIngredientDto[];

  @ApiProperty({ description: 'Số lượng mua', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
