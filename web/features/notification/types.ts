export type NotificationType = 'ORDER' | 'PROMO' | 'SYSTEM' | 'ACCOUNT';

export type NotificationFilterTab = 'ALL' | 'UNREAD' | 'ORDER' | 'PROMO';

export interface NotificationItemData {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO date string
  linkUrl?: string;
  metadata?: {
    orderNumber?: string;
    discountCode?: string;
    amount?: number;
  };
}
