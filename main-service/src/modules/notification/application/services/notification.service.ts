import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@/enums';
import { Notification } from '@/modules/notification/domain/entities/notification.domain';
import { type INotificationRepository } from '@/modules/notification/domain/repositories/notification.repository.interface';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  /**
   * Tạo thông báo mới cho người dùng
   */
  async createNotification(data: {
    userId?: string | null;
    title: string;
    content: string;
    type?: NotificationType;
  }): Promise<Notification> {
    return await this.notificationRepository.create(data);
  }

  /**
   * Lấy danh sách thông báo của một người dùng
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.findVisibleForUser(userId);
  }

  /**
   * Đánh dấu đã đọc cho một thông báo cụ thể
   */
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Đảm bảo thông báo thuộc về user này (hoặc là thông báo hệ thống chung)
    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Không tìm thấy thông báo cho người dùng này');
    }

    const updated = await this.notificationRepository.markAsRead(notificationId);
    if (!updated) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
    return updated;
  }

  /**
   * Đánh dấu đã đọc tất cả thông báo của một người dùng
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * Xóa thông báo (soft-delete)
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Bạn không có quyền xóa thông báo này');
    }

    await this.notificationRepository.softDelete(notificationId);
  }
}
