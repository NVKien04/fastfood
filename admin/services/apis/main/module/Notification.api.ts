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

  getNotifications = async (): Promise<BaseResponse<NotificationDto[]>> => {
    try {
      const response = await this.api.notificationControllerGetNotifications();
      return apiFormat<NotificationDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  markAsRead = async (id: string): Promise<BaseResponse<boolean>> => {
    try {
      const response = await this.api.notificationControllerMarkAsRead(id);
      return apiFormat<boolean>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  markAllAsRead = async (): Promise<BaseResponse<boolean>> => {
    try {
      const response = await this.api.notificationControllerMarkAllAsRead();
      return apiFormat<boolean>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
