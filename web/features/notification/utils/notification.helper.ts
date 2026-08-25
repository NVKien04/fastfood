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
        tagClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60',
        gradientBg: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600',
        iconBg: 'bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-100 dark:border-blue-900/40',
      };
    case 'PROMO':
      return {
        tagKey: 'NOTIFICATION.TYPE_PROMO',
        tagClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/60',
        gradientBg: 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500',
        iconBg: 'bg-orange-500/10 dark:bg-orange-400/10 text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-100 dark:border-orange-900/40',
      };
    case 'ACCOUNT':
      return {
        tagKey: 'NOTIFICATION.TYPE_ACCOUNT',
        tagClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60',
        gradientBg: 'bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500',
        iconBg: 'bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-100 dark:border-purple-900/40',
      };
    case 'SYSTEM':
    default:
      return {
        tagKey: 'NOTIFICATION.TYPE_SYSTEM',
        tagClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60',
        gradientBg: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600',
        iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-100 dark:border-emerald-900/40',
      };
  }
};

