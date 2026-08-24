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

import { DeliverySimulationControllerSimulateDeliveryData, SimulateDeliveryDto } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class DeliverySimulation<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Tự động chuyển đơn hàng qua các trạng thái CONFIRMED → PREPARING → READY_FOR_SHIPMENT → DELIVERED với khoảng thời gian delay cấu hình giữa mỗi bước (mặc định 5 giây). Chạy trong background.
   *
   * @tags Delivery Simulation
   * @name DeliverySimulationControllerSimulateDelivery
   * @summary Giả lập tiến trình giao hàng tự động (Admin - chỉ dùng cho test)
   * @request POST:/api/delivery-simulation/{orderId}/simulate
   * @secure
   */
  deliverySimulationControllerSimulateDelivery = (
    orderId: string,
    data: SimulateDeliveryDto,
    params: RequestParams = {},
  ) =>
    this.request<DeliverySimulationControllerSimulateDeliveryData, any>({
      path: `/api/delivery-simulation/${orderId}/simulate`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
