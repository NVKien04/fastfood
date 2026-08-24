import { TFunction } from 'i18next';
import { NotificationType } from '../types';

export const formatNotificationTime = (dateString: string, t: TFunction): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t('NOTIFICATION.TIME_JUST_NOW', 'Vừa xong');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t('NOTIFICATION.TIME_MINUTES_AGO', { count: diffInMinutes, defaultValue: `${diffInMinutes} phút trước` });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('NOTIFICATION.TIME_HOURS_AGO', { count: diffInHours, defaultValue: `${diffInHours} giờ trước` });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('NOTIFICATION.TIME_DAYS_AGO', { count: diffInDays, defaultValue: `${diffInDays} ngày trước` });
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
        badgeBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100/80 dark:bg-blue-900/40',
      };
    case 'PROMO':
      return {
        badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50',
        iconColor: 'text-[#ff6900]',
        iconBg: 'bg-orange-100/80 dark:bg-orange-950/60',
      };
    case 'ACCOUNT':
      return {
        badgeBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100/80 dark:bg-purple-900/40',
      };
    case 'SYSTEM':
    default:
      return {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
      };
  }
};
