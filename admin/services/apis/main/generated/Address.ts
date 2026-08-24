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
  AddressControllerCreateData,
  AddressControllerDeleteData,
  AddressControllerGetMyAddressesData,
  AddressControllerGetPageData,
  AddressControllerUpdateData,
  CreateAddressDto,
  UpdateAddressDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Address<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Address
   * @name AddressControllerGetPage
   * @summary Lấy danh sách địa chỉ phân trang
   * @request POST:/api/address/get-page
   */
  addressControllerGetPage = (params: RequestParams = {}) =>
    this.request<AddressControllerGetPageData, any>({
      path: `/api/address/get-page`,
      method: 'POST',
      ...params,
    });
  /**
   * No description
   *
   * @tags Address
   * @name AddressControllerCreate
   * @summary Thêm địa chỉ mới
   * @request POST:/api/address
   * @secure
   */
  addressControllerCreate = (data: CreateAddressDto, params: RequestParams = {}) =>
    this.request<AddressControllerCreateData, any>({
      path: `/api/address`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Address
   * @name AddressControllerGetMyAddresses
   * @summary Lấy danh sách địa chỉ của tôi
   * @request GET:/api/address/my
   * @secure
   */
  addressControllerGetMyAddresses = (params: RequestParams = {}) =>
    this.request<AddressControllerGetMyAddressesData, any>({
      path: `/api/address/my`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Address
   * @name AddressControllerUpdate
   * @summary Cập nhật địa chỉ
   * @request PATCH:/api/address/{id}
   * @secure
   */
  addressControllerUpdate = (id: string, data: UpdateAddressDto, params: RequestParams = {}) =>
    this.request<AddressControllerUpdateData, void>({
      path: `/api/address/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Address
   * @name AddressControllerDelete
   * @summary Xóa địa chỉ
   * @request DELETE:/api/address/{id}
   * @secure
   */
  addressControllerDelete = (id: string, params: RequestParams = {}) =>
    this.request<AddressControllerDeleteData, void>({
      path: `/api/address/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
