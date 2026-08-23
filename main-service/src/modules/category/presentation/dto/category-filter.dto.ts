import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class CategoryFilterDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 100 })
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({ example: 'sortOrder' })
  @IsOptional()
  @IsString()
  orderby?: string;

  @ApiPropertyOptional({ example: 'ASC', default: 'ASC' })
  @IsOptional()
  @IsString()
  orderDirection?: string;
}
