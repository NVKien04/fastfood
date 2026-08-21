import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @ApiPropertyOptional({ description: 'Thư mục lưu trữ trên S3', example: 'avatars', default: 'uploads' })
  @IsOptional()
  @IsString()
  folder?: string;
}
