import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@/enums';

export class CreateOrderItemIngredientDto {
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

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID sản phẩm (UUID)', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'ID biến thể sản phẩm (size/loại đế)', example: 2 })
  @IsInt()
  @IsOptional()
  productVariantId?: number;

  @ApiPropertyOptional({
    description: 'Danh sách nguyên liệu / topping chọn thêm',
    type: [CreateOrderItemIngredientDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemIngredientDto)
  @IsOptional()
  ingredients?: CreateOrderItemIngredientDto[];

  @ApiProperty({ description: 'Số lượng mua', example: 2, default: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Danh sách món ăn trong đơn', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsNotEmpty()
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ description: 'Họ tên người nhận hàng', example: 'Nguyen Van A' })
  @IsString()
  @IsOptional()
  guestName?: string;

  @ApiProperty({ description: 'Số điện thoại người nhận hàng', example: '0901234567' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiPropertyOptional({ description: 'Email người nhận hàng', example: 'customer@example.com' })
  @IsString()
  @IsOptional()
  guestEmail?: string;

  @ApiProperty({
    description: 'Địa chỉ giao hàng đầy đủ (nhập từ trình duyệt)',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  guestAddress: string;

  @ApiPropertyOptional({ description: 'Ghi chú cho nhà hàng / shipper', example: 'Giao giờ hành chính, không cay' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mã giảm giá áp dụng cho đơn hàng', example: 'FASTFOOD20' })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiPropertyOptional({
    description: 'Phương thức thanh toán',
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    example: PaymentMethod.COD,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
