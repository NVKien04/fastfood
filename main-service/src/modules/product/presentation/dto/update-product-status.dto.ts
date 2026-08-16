import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class UpdateProductStatusDto {
  @ApiPropertyOptional({ description: 'Trạng thái hoạt động (1: Đang bán, 0: Ngưng bán)', example: 1, enum: [0, 1] })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  isActive?: number;

  @ApiPropertyOptional({ description: 'Sản phẩm nổi bật (1: Có, 0: Không)', example: 1, enum: [0, 1] })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  isFeatured?: number;
}
