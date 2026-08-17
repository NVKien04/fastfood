import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationEntity } from '@/entities';
import { NotificationType } from '@/enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * Tạo thông báo mới cho người dùng
   */
  async createNotification(data: {
    userId?: string | null;
    title: string;
    content: string;
    type?: NotificationType;
  }): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create({
      userId: data.userId || null,
      title: data.title,
      content: data.content,
      type: data.type || NotificationType.SYSTEM,
      isRead: false,
    });
    return await this.notificationRepository.save(notification);
  }

  /**
   * Lấy danh sách thông báo của một người dùng
   */
  async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({
      where: [
        { userId: userId },
        { userId: IsNull() }, // Các thông báo hệ thống chung
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Đánh dấu đã đọc cho một thông báo cụ thể
   */
  async markAsRead(notificationId: string, userId: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Đảm bảo thông báo thuộc về user này (hoặc là thông báo hệ thống chung)
    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Không tìm thấy thông báo cho người dùng này');
    }

    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }

  /**
   * Đánh dấu đã đọc tất cả thông báo của một người dùng
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId: userId, isRead: false }, { isRead: true });
  }

  /**
   * Xóa thông báo (soft-delete)
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    if (notification.userId && notification.userId !== userId) {
      throw new NotFoundException('Bạn không có quyền xóa thông báo này');
    }

    await this.notificationRepository.softRemove(notification);
  }
}
