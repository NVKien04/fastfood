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
  ApplyCouponDto,
  CouponControllerApplyCouponData,
  CouponControllerCreateData,
  CouponControllerDeleteData,
  CouponControllerGetByIdData,
  CouponControllerGetPageData,
  CouponControllerUpdateData,
  CouponFilterDto,
  CreateCouponDto,
  UpdateCouponDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Coupon<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerApplyCoupon
   * @summary Kiểm tra và áp dụng mã giảm giá khi thanh toán (Công khai)
   * @request POST:/api/coupon/apply
   */
  couponControllerApplyCoupon = (data: ApplyCouponDto, params: RequestParams = {}) =>
    this.request<CouponControllerApplyCouponData, void>({
      path: `/api/coupon/apply`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerGetPage
   * @summary Lấy danh sách mã giảm giá phân trang (Admin)
   * @request POST:/api/coupon/get-page
   * @secure
   */
  couponControllerGetPage = (data: CouponFilterDto, params: RequestParams = {}) =>
    this.request<CouponControllerGetPageData, any>({
      path: `/api/coupon/get-page`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerCreate
   * @summary Tạo mới mã giảm giá (Admin)
   * @request POST:/api/coupon
   * @secure
   */
  couponControllerCreate = (data: CreateCouponDto, params: RequestParams = {}) =>
    this.request<CouponControllerCreateData, any>({
      path: `/api/coupon`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerGetById
   * @summary Lấy chi tiết mã giảm giá theo ID
   * @request GET:/api/coupon/{id}
   */
  couponControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<CouponControllerGetByIdData, void>({
      path: `/api/coupon/${id}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerUpdate
   * @summary Cập nhật mã giảm giá (Admin)
   * @request PATCH:/api/coupon/{id}
   * @secure
   */
  couponControllerUpdate = (id: string, data: UpdateCouponDto, params: RequestParams = {}) =>
    this.request<CouponControllerUpdateData, void>({
      path: `/api/coupon/${id}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Coupon
   * @name CouponControllerDelete
   * @summary Xóa mã giảm giá (Admin)
   * @request DELETE:/api/coupon/{id}
   * @secure
   */
  couponControllerDelete = (id: string, params: RequestParams = {}) =>
    this.request<CouponControllerDeleteData, void>({
      path: `/api/coupon/${id}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
}
