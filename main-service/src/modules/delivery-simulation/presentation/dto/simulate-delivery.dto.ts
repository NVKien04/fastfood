import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class SimulateDeliveryDto {
  @ApiPropertyOptional({
    description: 'Thời gian chờ giữa mỗi bước chuyển trạng thái (giây)',
    example: 5,
    default: 5,
    minimum: 1,
    maximum: 60,
  })
  @IsInt()
  @Min(1)
  @Max(60)
  @IsOptional()
  stepDelaySeconds?: number;
}
