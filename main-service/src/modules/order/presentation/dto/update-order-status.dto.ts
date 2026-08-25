import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@/enums';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới của đơn hàng',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.CONFIRMED,
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
