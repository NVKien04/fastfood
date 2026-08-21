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
  CreateProductDto,
  ProductControllerCreateData,
  ProductControllerDeleteData,
  ProductControllerGetByIdData,
  ProductControllerGetBySlugData,
  ProductControllerGetPageData,
  ProductControllerGetRelatedData,
  ProductControllerUpdateData,
  ProductControllerUpdateStatusData,
  ProductFilterDto,
  UpdateProductDto,
  UpdateProductStatusDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Product<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerGetPage
   * @summary Lấy danh sách sản phẩm phân trang và tìm kiếm/lọc
   * @request POST:/api/product/get-page
   */
  productControllerGetPage = (data: ProductFilterDto, params: RequestParams = {}) =>
    this.request<ProductControllerGetPageData, any>({
      path: `/api/product/get-page`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerCreate
   * @summary Tạo mới sản phẩm kèm biến thể và thành phần
   * @request POST:/api/product
   * @secure
   */
  productControllerCreate = (data: CreateProductDto, params: RequestParams = {}) =>
    this.request<ProductControllerCreateData, void>({
      path: `/api/product`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerGetBySlug
   * @summary Lấy chi tiết sản phẩm theo Slug (kèm biến thể và nguyên liệu)
   * @request GET:/api/product/slug/{slug}
   */
  productControllerGetBySlug = (slug: string, params: RequestParams = {}) =>
    this.request<ProductControllerGetBySlugData, void>({
      path: `/api/product/slug/${slug}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerGetRelated
   * @summary Lấy danh sách sản phẩm liên quan (cùng danh mục)
   * @request GET:/api/product/{id}/related
   */
  productControllerGetRelated = (id: string, params: RequestParams = {}) =>
    this.request<ProductControllerGetRelatedData, void>({
      path: `/api/product/${id}/related`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerGetById
   * @summary Lấy chi tiết sản phẩm theo ID (kèm biến thể và nguyên liệu)
   * @request GET:/api/product/{id}
   */
  productControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<ProductControllerGetByIdData, void>({
      path: `/api/product/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerUpdate
   * @summary Cập nhật sản phẩm, biến thể và thành phần
   * @request PATCH:/api/product/{id}
   * @secure
   */
  productControllerUpdate = (id: string, data: UpdateProductDto, params: RequestParams = {}) =>
    this.request<ProductControllerUpdateData, void>({
      path: `/api/product/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerDelete
   * @summary Xóa sản phẩm theo ID
   * @request DELETE:/api/product/{id}
   * @secure
   */
  productControllerDelete = (id: string, params: RequestParams = {}) =>
    this.request<ProductControllerDeleteData, void>({
      path: `/api/product/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerUpdateStatus
   * @summary Cập nhật trạng thái nhanh (isActive, isFeatured) của sản phẩm
   * @request PATCH:/api/product/{id}/status
   * @secure
   */
  productControllerUpdateStatus = (id: string, data: UpdateProductStatusDto, params: RequestParams = {}) =>
    this.request<ProductControllerUpdateStatusData, void>({
      path: `/api/product/${id}/status`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
