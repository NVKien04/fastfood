import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@/enums/payment-method.enum';

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

  @ApiPropertyOptional({ description: 'ID địa chỉ giao hàng của User (nếu đã đăng nhập)', example: 'uuid-address-id' })
  @IsUUID()
  @IsOptional()
  addressId?: string;

  @ApiPropertyOptional({ description: 'Họ tên khách hàng (nếu mua không cần tài khoản)', example: 'Nguyen Van A' })
  @IsString()
  @IsOptional()
  guestName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại nhận hàng', example: '0901234567' })
  @IsString()
  @IsOptional()
  guestPhone?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ giao hàng đầy đủ', example: '123 Đường ABC, Quận 1, TP.HCM' })
  @IsString()
  @IsOptional()
  guestAddress?: string;

  @ApiPropertyOptional({ description: 'Ghi chú cho nhà hàng / shipper', example: 'Giao giờ hành chính, không cay' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mã giảm giá áp dụng cho đơn hàng', example: 'FASTFOOD20' })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán', enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
