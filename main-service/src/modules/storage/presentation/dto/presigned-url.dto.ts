import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetPresignedUrlDto {
  @ApiProperty({ description: 'Tên file gốc', example: 'photo.png' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'MIME type của file', example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @ApiPropertyOptional({ description: 'Thư mục lưu trữ trên S3', example: 'products', default: 'uploads' })
  @IsOptional()
  @IsString()
  folder?: string;
}
