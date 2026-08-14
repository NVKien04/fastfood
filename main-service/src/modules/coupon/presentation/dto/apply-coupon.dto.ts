import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ description: 'Mã giảm giá cần áp dụng', example: 'FASTFOOD20' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tổng tiền hàng trước khi áp dụng voucher (VND)', example: 120000 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  subTotal: number;
}

export class ApplyCouponResponseDto {
  @ApiProperty({ description: 'Mã giảm giá', example: 'FASTFOOD20' })
  code: string;

  @ApiProperty({ description: 'Tên voucher', example: 'Giảm 20k cho đơn từ 100k' })
  name: string;

  @ApiProperty({ description: 'Số tiền được giảm (VND)', example: 20000 })
  discount: number;

  @ApiProperty({ description: 'Tổng tiền sau khi giảm giá (VND)', example: 100000 })
  finalTotal: number;
}
