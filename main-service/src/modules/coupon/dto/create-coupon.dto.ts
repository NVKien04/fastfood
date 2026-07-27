import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ description: 'Mã coupon', example: 'KM50K' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tên chương trình khuyến mãi', example: 'Khuyến mãi giảm 50k' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết khuyến mãi', example: 'Giảm 50k cho đơn hàng từ 200k' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Giá trị giảm giá', example: 50000 })
  @IsInt()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ description: 'Giá trị đơn hàng tối thiểu áp dụng (VNĐ)', example: 200000, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Số lượt sử dụng tối đa của coupon này', example: 100, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxUser?: number;

  @ApiProperty({ description: 'Ngày bắt đầu áp dụng', example: '2026-07-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Ngày hết hạn áp dụng', example: '2026-12-31T23:59:59.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động (0: ẩn, 1: hoạt động)', example: 1, default: 1 })
  @IsInt()
  @IsOptional()
  isActive?: number;
}
