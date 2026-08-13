import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';

export interface UploadImageResponseDto {
  key: string;
  url: string;
  bucket: string;
  mimetype: string;
  size: number;
}

export class UploadApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Upload 1 hình ảnh trực tiếp lên S3 thông qua backend
   */
  uploadImage = async (file: File, folder = 'avatars'): Promise<BaseResponse<UploadImageResponseDto>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await this.http.instance.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return apiFormat<UploadImageResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      console.error('Error uploading image:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
