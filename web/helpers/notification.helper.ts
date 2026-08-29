import { TFunction } from 'i18next';
import { NotificationType, NotificationItemData } from '../features/notification/types';
import { toDayjs } from '@/utils/time';
import dayjs from 'dayjs';

export const formatNotificationTime = (dateString: string, t: TFunction): string => {
  if (!dateString) return '';
  try {
    const date = toDayjs(dateString);
    const now = dayjs();
    const diffInSeconds = Math.floor(Math.abs(now.diff(date, 'second')));

    if (diffInSeconds < 60) {
      return t('NOTIFICATION.TIME_JUST_NOW');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t('NOTIFICATION.TIME_MINUTES_AGO', { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('NOTIFICATION.TIME_HOURS_AGO', { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('NOTIFICATION.TIME_DAYS_AGO', { count: diffInDays });
    }

    return date.format('DD/MM/YYYY');
  } catch {
    return '';
  }
};

export const getNotificationTypeMeta = (type: NotificationType) => {
  switch (type) {
    case 'ORDER':
      return {
        tagKey: 'NOTIFICATION.TYPE_ORDER',
        tagClass:
          'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border-gray-200/60 dark:border-zinc-700/60',
      };
    case 'PROMO':
      return {
        tagKey: 'NOTIFICATION.TYPE_PROMO',
        tagClass:
          'bg-orange-50 text-[#ff6900] dark:bg-orange-950/40 dark:text-orange-400 border-orange-200/60 dark:border-orange-900/40',
      };
    case 'ACCOUNT':
      return {
        tagKey: 'NOTIFICATION.TYPE_ACCOUNT',
        tagClass:
          'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border-gray-200/60 dark:border-zinc-700/60',
      };
    case 'SYSTEM':
    default:
      return {
        tagKey: 'NOTIFICATION.TYPE_SYSTEM',
        tagClass:
          'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border-gray-200/60 dark:border-zinc-700/60',
      };
  }
};

export const normalizeNotificationType = (
  rawType?: string | null,
  title?: string,
  message?: string,
): NotificationType => {
  const upper = (rawType || '').toUpperCase().trim();
  if (upper.includes('ORDER')) return 'ORDER';
  if (upper.includes('PROMO') || upper.includes('VOUCHER') || upper.includes('COUPON') || upper.includes('DISCOUNT'))
    return 'PROMO';
  if (upper.includes('ACCOUNT') || upper.includes('USER') || upper.includes('VIP')) return 'ACCOUNT';

  // Fallback detection from title & message content
  const content = `${title || ''} ${message || ''}`.toLowerCase();
  if (content.includes('đơn hàng') || content.includes('giao hàng') || content.includes('order')) return 'ORDER';
  if (
    content.includes('voucher') ||
    content.includes('khuyến mãi') ||
    content.includes('freeship') ||
    content.includes('giảm') ||
    content.includes('ưu đãi') ||
    content.includes('promo') ||
    content.includes('sale')
  )
    return 'PROMO';
  if (content.includes('vip') || content.includes('thành viên') || content.includes('tài khoản')) return 'ACCOUNT';

  return 'SYSTEM';
};

export const mapApiNotificationToItem = (item: {
  id: string;
  title: string;
  message?: string;
  content?: string;
  type?: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
  img?: string;
  thumbnail?: string;
}): NotificationItemData => {
  const msg = item.message || item.content || '';
  const type = normalizeNotificationType(item.type, item.title, msg);

  // Phân loại điều hướng:
  // 1. ORDER: Đến trang chi tiết đơn hàng /orders/{id}
  // 2. PROMO: Đến trang voucher /vouchers
  // 3. SYSTEM: Không có link điều hướng (undefined)
  let linkUrl: string | undefined = item.linkUrl;
  if (!linkUrl) {
    if (type === 'ORDER') {
      if (msg.includes('::')) {
        const parts = msg.split('::');
        // parts = [KEY, orderNumber, orderId]
        const orderIdOrNum = parts[2] || parts[1];
        linkUrl = orderIdOrNum ? `/orders/${orderIdOrNum}` : '/orders';
      } else {
        linkUrl = '/orders';
      }
    } else if (type === 'PROMO') {
      linkUrl = '/vouchers';
    } else {
      linkUrl = undefined;
    }
  }

  return {
    id: String(item.id),
    title: item.title,
    message: msg,
    type,
    isRead: Boolean(item.isRead),
    createdAt: item.createdAt || new Date().toISOString(),
    linkUrl,
    img: item.img || item.thumbnail,
  };
};

export const renderNotificationText = (rawText: string, t: TFunction): string => {
  if (!rawText) return '';
  if (rawText.startsWith('NOTIFICATION.')) {
    if (rawText.includes('::')) {
      const parts = rawText.split('::');
      const key = parts[0];
      const orderNumber = parts[1] || '';
      const reason = parts[2];
      return t(key, {
        orderNumber,
        reason: reason || '',
        defaultValue: `${key} #${orderNumber}`,
      });
    }
    return t(rawText, { defaultValue: rawText });
  }
  return rawText;
};
