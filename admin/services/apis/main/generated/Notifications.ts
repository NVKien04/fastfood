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
  NotificationControllerDeleteNotificationData,
  NotificationControllerGetNotificationsData,
  NotificationControllerMarkAllAsReadData,
  NotificationControllerMarkAsReadData,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Notifications<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Notification
   * @name NotificationControllerGetNotifications
   * @request GET:/api/notifications
   */
  notificationControllerGetNotifications = (params: RequestParams = {}) =>
    this.request<NotificationControllerGetNotificationsData, any>({
      path: `/api/notifications`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notification
   * @name NotificationControllerMarkAllAsRead
   * @request PATCH:/api/notifications/read-all
   */
  notificationControllerMarkAllAsRead = (params: RequestParams = {}) =>
    this.request<NotificationControllerMarkAllAsReadData, any>({
      path: `/api/notifications/read-all`,
      method: 'PATCH',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notification
   * @name NotificationControllerMarkAsRead
   * @request PATCH:/api/notifications/{id}/read
   */
  notificationControllerMarkAsRead = (id: string, params: RequestParams = {}) =>
    this.request<NotificationControllerMarkAsReadData, any>({
      path: `/api/notifications/${id}/read`,
      method: 'PATCH',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notification
   * @name NotificationControllerDeleteNotification
   * @request DELETE:/api/notifications/{id}
   */
  notificationControllerDeleteNotification = (id: string, params: RequestParams = {}) =>
    this.request<NotificationControllerDeleteNotificationData, any>({
      path: `/api/notifications/${id}`,
      method: 'DELETE',
      ...params,
    });
}
