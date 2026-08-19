import { Notification } from '@/modules/notification/domain/entities/notification.domain';

export interface CreateNotificationInput {
  userId?: string | null;
  title: string;
  content: string;
  type?: Notification['type'];
}

export interface INotificationRepository {
  create(data: CreateNotificationInput): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findVisibleForUser(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification | null>;
  markAllAsRead(userId: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
