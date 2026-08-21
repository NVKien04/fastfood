import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StorageFolderEnum } from '@/enums';

export class GetPresignedUrlDto {
  @ApiProperty({ description: 'Tên file gốc', example: 'photo.png' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'MIME type của file', example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @ApiPropertyOptional({
    description: 'Thư mục lưu trữ trên S3',
    enum: StorageFolderEnum,
    enumName: 'StorageFolderEnum',
    example: StorageFolderEnum.PRODUCTS,
    default: StorageFolderEnum.OTHERS,
  })
  @IsOptional()
  @IsEnum(StorageFolderEnum, {
    message: `folder phải thuộc một trong các giá trị: ${Object.values(StorageFolderEnum).join(', ')}`,
  })
  folder?: StorageFolderEnum;
}
