import { NotificationEntity } from '@/entities';
import { Notification } from '@/modules/notification/domain/entities/notification.domain';

export class NotificationMapper {
  static toDomain(entity: NotificationEntity): Notification {
    if (!entity) {
      throw new Error('NotificationMapper.toDomain requires an entity');
    }

    return new Notification({
      id: entity.id,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      isRead: entity.isRead,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toDomainList(entities: NotificationEntity[]): Notification[] {
    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }
}
