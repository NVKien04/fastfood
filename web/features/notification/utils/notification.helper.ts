import { TFunction } from 'i18next';
import { NotificationType } from '../types';

export const formatNotificationTime = (dateString: string, t: TFunction): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
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
