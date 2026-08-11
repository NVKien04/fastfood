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
  UpdateUserDto,
  UserControllerDeleteData,
  UserControllerGetAllData,
  UserControllerGetByIdData,
  UserControllerGetInfoData,
  UserControllerGetPageData,
  UserControllerUpdateData,
  UserFilterDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Users<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetAll
   * @summary Lấy tất cả danh sách người dùng (Admin)
   * @request GET:/api/users
   * @secure
   */
  userControllerGetAll = (params: RequestParams = {}) =>
    this.request<UserControllerGetAllData, any>({
      path: `/api/users`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetInfo
   * @summary Lấy thông tin cá nhân người dùng đang đăng nhập
   * @request GET:/api/users/info
   * @secure
   */
  userControllerGetInfo = (params: RequestParams = {}) =>
    this.request<UserControllerGetInfoData, void>({
      path: `/api/users/info`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetById
   * @summary Lấy thông tin người dùng theo ID (Admin)
   * @request GET:/api/users/{id}
   * @secure
   */
  userControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<UserControllerGetByIdData, void>({
      path: `/api/users/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerDelete
   * @summary Xóa người dùng theo ID (Admin)
   * @request DELETE:/api/users/{id}
   * @secure
   */
  userControllerDelete = (id: string, params: RequestParams = {}) =>
    this.request<UserControllerDeleteData, void>({
      path: `/api/users/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerUpdate
   * @summary Cập nhật thông tin cá nhân
   * @request PATCH:/api/users/update
   * @secure
   */
  userControllerUpdate = (data: UpdateUserDto, params: RequestParams = {}) =>
    this.request<UserControllerUpdateData, any>({
      path: `/api/users/update`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetPage
   * @summary Lấy danh sách người dùng phân trang (Admin)
   * @request POST:/api/users/get-page
   * @secure
   */
  userControllerGetPage = (data: UserFilterDto, params: RequestParams = {}) =>
    this.request<UserControllerGetPageData, any>({
      path: `/api/users/get-page`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
