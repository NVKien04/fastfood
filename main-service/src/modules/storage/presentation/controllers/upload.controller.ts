import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { IStorageService } from '@/modules/storage/domain/interface/storage.interface';
import {
  UploadImageDto,
  UploadMultipleImagesDto,
  DeleteFileDto,
  GetPresignedUrlDto,
} from '@/modules/storage/presentation/dto';
import { StorageFolderEnum } from '@/enums';

@ApiTags('Upload & Storage')
@Controller('upload')
export class UploadController {
  constructor(
    @Inject('IStorageService')
    private readonly storageService: IStorageService,
  ) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload 1 file ảnh lên AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({ status: 201, description: 'Upload thành công' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file?: Express.Multer.File, @Body() body?: UploadImageDto) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh để upload');
    }

    const result = await this.storageService.uploadFile(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      {
        folder: body?.folder || StorageFolderEnum.OTHERS,
      },
    );

    return {
      data: result,
      message: 'Upload file thành công',
    };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload nhiều file ảnh cùng lúc lên AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImagesDto })
  @ApiResponse({ status: 201, description: 'Upload nhiều file thành công' })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(@UploadedFiles() files?: Express.Multer.File[], @Body() body?: UploadMultipleImagesDto) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file để upload');
    }

    const folder = body?.folder || StorageFolderEnum.OTHERS;
    const uploadPromises = files.map((file) =>
      this.storageService.uploadFile(
        {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
        { folder },
      ),
    );

    const results = await Promise.all(uploadPromises);

    return {
      data: results,
      message: `Upload thành công ${results.length} files`,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa file trên AWS S3 theo Key hoặc URL' })
  @ApiResponse({ status: 200, description: 'Xóa file thành công' })
  async deleteFile(@Body() dto: DeleteFileDto) {
    const success = await this.storageService.deleteFile(dto.keyOrUrl);
    if (!success) {
      throw new BadRequestException('Không thể xóa file hoặc file không tồn tại');
    }

    return {
      message: 'Xóa file thành công',
      data: { success: true },
    };
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Tạo Presigned URL để upload trực tiếp từ Frontend lên S3' })
  @ApiResponse({ status: 201, description: 'Tạo Presigned URL thành công' })
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    const result = await this.storageService.getPresignedUploadUrl({
      filename: dto.filename,
      mimetype: dto.mimetype,
      folder: dto.folder || 'uploads',
    });

    return {
      data: result,
      message: 'Tạo Presigned URL thành công',
    };
  }
}
