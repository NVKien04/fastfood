/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  DeleteFileDto,
  GetPresignedUrlDto,
  UploadControllerDeleteFileData,
  UploadControllerGetPresignedUrlData,
  UploadControllerUploadImageData,
  UploadControllerUploadMultipleImagesData,
  UploadImageDto,
  UploadMultipleImagesDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Upload<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Upload & Storage
   * @name UploadControllerUploadImage
   * @summary Upload 1 file ảnh lên AWS S3
   * @request POST:/api/upload/image
   */
  uploadControllerUploadImage = (data: UploadImageDto, params: RequestParams = {}) =>
    this.request<UploadControllerUploadImageData, any>({
      path: `/api/upload/image`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags Upload & Storage
   * @name UploadControllerUploadMultipleImages
   * @summary Upload nhiều file ảnh cùng lúc lên AWS S3
   * @request POST:/api/upload/multiple
   */
  uploadControllerUploadMultipleImages = (data: UploadMultipleImagesDto, params: RequestParams = {}) =>
    this.request<UploadControllerUploadMultipleImagesData, any>({
      path: `/api/upload/multiple`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags Upload & Storage
   * @name UploadControllerDeleteFile
   * @summary Xóa file trên AWS S3 theo Key hoặc URL
   * @request DELETE:/api/upload
   */
  uploadControllerDeleteFile = (data: DeleteFileDto, params: RequestParams = {}) =>
    this.request<UploadControllerDeleteFileData, any>({
      path: `/api/upload`,
      method: 'DELETE',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Upload & Storage
   * @name UploadControllerGetPresignedUrl
   * @summary Tạo Presigned URL để upload trực tiếp từ Frontend lên S3
   * @request POST:/api/upload/presigned-url
   */
  uploadControllerGetPresignedUrl = (data: GetPresignedUrlDto, params: RequestParams = {}) =>
    this.request<UploadControllerGetPresignedUrlData, any>({
      path: `/api/upload/presigned-url`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
