import { NotificationType } from '@/enums';

export class Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
