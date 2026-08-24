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
  CreateIngredientDto,
  IngredientControllerCreateData,
  IngredientControllerDeleteData,
  IngredientControllerGetByIdData,
  IngredientControllerGetPageData,
  IngredientControllerUpdateData,
  UpdateIngredientDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Ingredient<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Ingredient
   * @name IngredientControllerGetPage
   * @summary Lấy danh sách nguyên liệu phân trang
   * @request POST:/api/ingredient/get-page
   */
  ingredientControllerGetPage = (params: RequestParams = {}) =>
    this.request<IngredientControllerGetPageData, any>({
      path: `/api/ingredient/get-page`,
      method: 'POST',
      ...params,
    });
  /**
   * No description
   *
   * @tags Ingredient
   * @name IngredientControllerCreate
   * @summary Tạo mới nguyên liệu
   * @request POST:/api/ingredient
   * @secure
   */
  ingredientControllerCreate = (data: CreateIngredientDto, params: RequestParams = {}) =>
    this.request<IngredientControllerCreateData, any>({
      path: `/api/ingredient`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Ingredient
   * @name IngredientControllerGetById
   * @summary Lấy chi tiết nguyên liệu theo ID
   * @request GET:/api/ingredient/{id}
   */
  ingredientControllerGetById = (id: number, params: RequestParams = {}) =>
    this.request<IngredientControllerGetByIdData, void>({
      path: `/api/ingredient/${id}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Ingredient
   * @name IngredientControllerUpdate
   * @summary Cập nhật nguyên liệu
   * @request PATCH:/api/ingredient/{id}
   * @secure
   */
  ingredientControllerUpdate = (id: number, data: UpdateIngredientDto, params: RequestParams = {}) =>
    this.request<IngredientControllerUpdateData, void>({
      path: `/api/ingredient/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Ingredient
   * @name IngredientControllerDelete
   * @summary Xóa nguyên liệu
   * @request DELETE:/api/ingredient/{id}
   * @secure
   */
  ingredientControllerDelete = (id: number, params: RequestParams = {}) =>
    this.request<IngredientControllerDeleteData, void>({
      path: `/api/ingredient/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
