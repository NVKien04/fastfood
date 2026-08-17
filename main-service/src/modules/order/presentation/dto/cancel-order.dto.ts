import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
  @ApiPropertyOptional({ description: 'Lý do hủy đơn hàng', example: 'Tôi đổi ý, không muốn đặt nữa' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}
