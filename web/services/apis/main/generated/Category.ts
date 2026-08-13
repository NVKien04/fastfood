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
  CategoryControllerCreateData,
  CategoryControllerDeleteData,
  CategoryControllerGetByIdData,
  CategoryControllerGetBySlugData,
  CategoryControllerGetPageData,
  CategoryControllerUpdateData,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Category<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerGetPage
   * @summary Lấy danh sách danh mục phân trang
   * @request POST:/api/category/get-page
   */
  categoryControllerGetPage = (data?: Record<string, unknown>, params: RequestParams = {}) =>
    this.request<CategoryControllerGetPageData, unknown>({
      path: `/api/category/get-page`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerCreate
   * @summary Tạo mới danh mục
   * @request POST:/api/category
   * @secure
   */
  categoryControllerCreate = (data: CreateCategoryDto, params: RequestParams = {}) =>
    this.request<CategoryControllerCreateData, void>({
      path: `/api/category`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerGetBySlug
   * @summary Lấy chi tiết danh mục theo Slug
   * @request GET:/api/category/slug/{slug}
   */
  categoryControllerGetBySlug = (slug: string, params: RequestParams = {}) =>
    this.request<CategoryControllerGetBySlugData, void>({
      path: `/api/category/slug/${slug}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerGetById
   * @summary Lấy chi tiết danh mục theo ID
   * @request GET:/api/category/{id}
   */
  categoryControllerGetById = (id: number, params: RequestParams = {}) =>
    this.request<CategoryControllerGetByIdData, void>({
      path: `/api/category/${id}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerUpdate
   * @summary Cập nhật danh mục
   * @request PATCH:/api/category/{id}
   * @secure
   */
  categoryControllerUpdate = (id: number, data: UpdateCategoryDto, params: RequestParams = {}) =>
    this.request<CategoryControllerUpdateData, void>({
      path: `/api/category/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Category
   * @name CategoryControllerDelete
   * @summary Xóa danh mục
   * @request DELETE:/api/category/{id}
   * @secure
   */
  categoryControllerDelete = (id: number, params: RequestParams = {}) =>
    this.request<CategoryControllerDeleteData, void>({
      path: `/api/category/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
