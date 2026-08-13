import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { S3StorageService } from '@/common/storage';
import { PresignedUrlRequestDto } from './dto/presigned-url-request.dto';
import { DeleteFileRequestDto } from './dto/delete-file-request.dto';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: S3StorageService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload 1 hình ảnh trực tiếp lên S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File hình ảnh (JPEG, PNG, WEBP, GIF, SVG)',
        },
        folder: {
          type: 'string',
          description: 'Thư mục trên S3 (vd: products, avatars, categories)',
          example: 'products',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Upload thành công' })
  async uploadImage(
    @UploadedFile() file?: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BusinessException(ErrorEnum.VALIDATION_ERROR);
    }

    const result = await this.storageService.uploadFile(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      { folder: folder || 'images' },
    );

    return {
      message: 'Upload hình ảnh thành công',
      data: result,
    };
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Tạo Presigned URL để FE upload trực tiếp lên S3' })
  @ApiResponse({ status: 201, description: 'Tạo URL thành công' })
  async getPresignedUrl(@Body() dto: PresignedUrlRequestDto) {
    const result = await this.storageService.getPresignedUploadUrl({
      filename: dto.filename,
      mimetype: dto.mimetype,
      folder: dto.folder || 'uploads',
    });

    return {
      message: 'Tạo presigned upload URL thành công',
      data: result,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa file trên S3 theo Key hoặc URL' })
  @ApiResponse({ status: 200, description: 'Xóa file thành công' })
  async deleteFile(@Body() dto: DeleteFileRequestDto) {
    const success = await this.storageService.deleteFile(dto.fileUrlOrKey);
    return {
      success,
      message: success ? 'Xóa file thành công' : 'Không thể xóa file hoặc file không tồn tại',
    };
  }
}
