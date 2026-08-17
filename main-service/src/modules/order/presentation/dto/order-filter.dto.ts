import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { OrderStatus } from '@/enums';

export class OrderFilterDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Số lượng phần tử trên trang', example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái đơn hàng', enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Lọc theo ID người dùng', example: 'uuid-user-id' })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
