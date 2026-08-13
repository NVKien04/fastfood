import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Số lượng mua mới (>= 0, nếu 0 sẽ xóa khỏi giỏ)', example: 2 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
