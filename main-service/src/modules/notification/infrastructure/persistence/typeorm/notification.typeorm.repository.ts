import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationEntity } from '@/entities';
import { NotificationType } from '@/enums';
import { Notification } from '@/modules/notification/domain/entities/notification.domain';
import {
  CreateNotificationInput,
  INotificationRepository,
} from '@/modules/notification/domain/repositories/notification.repository.interface';
import { NotificationMapper } from '@/modules/notification/infrastructure/mappers/notification.mapper';

@Injectable()
export class NotificationTypeOrmRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async create(data: CreateNotificationInput): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId: data.userId || null,
      title: data.title,
      content: data.content,
      type: data.type || NotificationType.SYSTEM,
      isRead: false,
    });
    const saved = await this.notificationRepository.save(notification);
    return NotificationMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    return notification ? NotificationMapper.toDomain(notification) : null;
  }

  async findVisibleForUser(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: [{ userId }, { userId: IsNull() }],
      order: {
        createdAt: 'DESC',
      },
    });
    return NotificationMapper.toDomainList(notifications);
  }

  async markAsRead(id: string): Promise<Notification | null> {
    await this.notificationRepository.update(id, { isRead: true });
    return this.findById(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
  }

  async softDelete(id: string): Promise<void> {
    await this.notificationRepository.softDelete(id);
  }
}
