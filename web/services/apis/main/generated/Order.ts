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
  CancelOrderDto,
  CreateOrderDto,
  OrderControllerCancelOrderData,
  OrderControllerCreateOrderData,
  OrderControllerGetMyOrdersData,
  OrderControllerGetOrderByIdData,
  OrderControllerGetOrdersPageData,
  OrderControllerUpdateStatusData,
  OrderFilterDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Order<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerCreateOrder
   * @summary Tạo đơn hàng mới (Hỗ trợ cả người dùng đăng nhập & vãng lai)
   * @request POST:/api/order
   */
  orderControllerCreateOrder = (data: CreateOrderDto, params: RequestParams = {}) =>
    this.request<OrderControllerCreateOrderData, any>({
      path: `/api/order`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerGetMyOrders
   * @summary Lấy danh sách đơn hàng cá nhân
   * @request GET:/api/order/my-orders
   * @secure
   */
  orderControllerGetMyOrders = (params: RequestParams = {}) =>
    this.request<OrderControllerGetMyOrdersData, any>({
      path: `/api/order/my-orders`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerGetOrdersPage
   * @summary Lấy danh sách đơn hàng phân trang (Admin)
   * @request POST:/api/order/get-page
   * @secure
   */
  orderControllerGetOrdersPage = (data: OrderFilterDto, params: RequestParams = {}) =>
    this.request<OrderControllerGetOrdersPageData, any>({
      path: `/api/order/get-page`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerGetOrderById
   * @summary Lấy chi tiết đơn hàng theo ID (kiểm tra quyền sở hữu)
   * @request GET:/api/order/{id}
   * @secure
   */
  orderControllerGetOrderById = (id: string, params: RequestParams = {}) =>
    this.request<OrderControllerGetOrderByIdData, any>({
      path: `/api/order/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerCancelOrder
   * @summary Khách hàng hủy đơn hàng (chỉ khi đơn ở trạng thái PENDING hoặc CONFIRMED)
   * @request POST:/api/order/{id}/cancel
   * @secure
   */
  orderControllerCancelOrder = (id: string, data: CancelOrderDto, params: RequestParams = {}) =>
    this.request<OrderControllerCancelOrderData, any>({
      path: `/api/order/${id}/cancel`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Order
   * @name OrderControllerUpdateStatus
   * @summary Cập nhật trạng thái đơn hàng (Admin / Shipper) - áp dụng State Machine
   * @request PATCH:/api/order/{id}/status
   * @secure
   */
  orderControllerUpdateStatus = (id: string, params: RequestParams = {}) =>
    this.request<OrderControllerUpdateStatusData, any>({
      path: `/api/order/${id}/status`,
      method: 'PATCH',
      secure: true,
      ...params,
    });
}
