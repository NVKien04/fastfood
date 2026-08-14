import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CouponFilterDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại (bắt đầu từ 1)', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Số lượng mục trên mỗi trang', example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Sắp xếp theo trường', example: 'createdAt' })
  @IsString()
  @IsOptional()
  orderby?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái kích hoạt (1: Đang hoạt động, 0: Tắt)', example: 1 })
  @IsInt()
  @IsOptional()
  isActive?: number;
}
