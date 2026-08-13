import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PresignedUrlRequestDto {
  @ApiProperty({ description: 'Tên file gốc', example: 'pizza.jpg' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'Loại MIME của file', example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @ApiPropertyOptional({ description: 'Thư mục lưu trữ trên S3', example: 'products' })
  @IsString()
  @IsOptional()
  folder?: string;
}
