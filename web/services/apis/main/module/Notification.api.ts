import { AxiosRequestConfig } from 'axios';
import { Notifications } from '../generated/Notifications';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';

export interface NotificationDto {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'ORDER' | 'PROMO' | 'SYSTEM' | 'ACCOUNT';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export class NotificationApiModule {
  public api: Notifications<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Notifications<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách thông báo của người dùng
   */
  getNotifications = async (): Promise<BaseResponse<NotificationDto[]>> => {
    try {
      const response = await this.api.notificationControllerGetNotifications();
      return apiFormat<NotificationDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  markAsRead = async (id: string): Promise<BaseResponse<boolean>> => {
    try {
      const response = await this.api.notificationControllerMarkAsRead(id);
      return apiFormat<boolean>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead = async (): Promise<BaseResponse<boolean>> => {
    try {
      const response = await this.api.notificationControllerMarkAllAsRead();
      return apiFormat<boolean>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa 1 thông báo
   */
  deleteNotification = async (id: string): Promise<BaseResponse<boolean>> => {
    try {
      const response = await this.api.notificationControllerDeleteNotification(id);
      return apiFormat<boolean>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
