export type NotificationType = 'ORDER' | 'PROMO' | 'SYSTEM' | 'ACCOUNT';

export type NotificationFilterTab = 'ALL' | 'UNREAD' | 'ORDER' | 'PROMO';

export type NotificationItemData = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO date string
  linkUrl?: string;
  img?: string;
  metadata?: {
    orderNumber?: string;
    discountCode?: string;
    amount?: number;
  };
};

