import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StorageFolderEnum } from '@/enums';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File ảnh cần upload (jpg, jpeg, png, webp, gif, svg)',
  })
  file: Express.Multer.File;

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

export class UploadMultipleImagesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Danh sách các file ảnh',
  })
  files: Express.Multer.File[];

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
