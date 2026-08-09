import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserFilterDto {
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại (mặc định 1)', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số lượng phần tử trên mỗi trang (mặc định 10)', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'createdAt:DESC', description: 'Sắp xếp theo trường (ví dụ: createdAt:DESC)' })
  @IsOptional()
  @IsString()
  orderby?: string;

  @ApiPropertyOptional({ description: 'Điều kiện lọc bổ sung', type: Object })
  @IsOptional()
  filter?: Record<string, any>;
}
