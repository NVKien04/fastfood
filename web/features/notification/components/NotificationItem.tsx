'use client';

import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Ticket, Bell, Sparkles, Trash2, ChevronRight } from 'lucide-react';
import { NotificationItemData } from '../types';
import { formatNotificationTime, getNotificationTypeMeta } from '../utils/notification.helper';

type NotificationItemProps = {
  notification: NotificationItemData;
  onClick: (item: NotificationItemData) => void;
  onDelete: (id: string, e: MouseEvent) => void;
};

export const NotificationItem = ({ notification, onClick, onDelete }: NotificationItemProps) => {
  const { t } = useTranslation();
  const timeString = formatNotificationTime(notification.createdAt, t);
  const typeMeta = getNotificationTypeMeta(notification.type);

  const getIcon = () => {
    switch (notification.type) {
      case 'ORDER':
        return <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'PROMO':
        return <Ticket className="w-4 h-4 text-[#ff6900]" />;
      case 'ACCOUNT':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'SYSTEM':
      default:
        return <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer select-none flex items-start gap-3.5 border ${
        notification.isRead
          ? 'bg-white dark:bg-zinc-900/60 border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/60 hover:border-gray-100 dark:hover:border-zinc-800'
          : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-100/70 dark:border-orange-900/30 hover:bg-orange-50/70 dark:hover:bg-orange-950/40'
      }`}
    >
      {/* Category Icon Badge */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${typeMeta.iconBg}`}
      >
        {getIcon()}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h5
            className={`text-xs sm:text-[13px] line-clamp-1 tracking-tight ${
              notification.isRead
                ? 'font-bold text-gray-800 dark:text-zinc-200'
                : 'font-black text-gray-900 dark:text-white'
            }`}
          >
            {notification.title}
          </h5>

          {/* Unread indicator dot */}
          {!notification.isRead && (
            <span
              className="w-2 h-2 rounded-full bg-[#ff6900] shrink-0 animate-pulse"
              title={t('NOTIFICATION.UNREAD', 'chưa đọc')}
            />
          )}
        </div>

        {/* Message */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-2">
          {notification.message}
        </p>

        {/* Bottom Time & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">
            {timeString}
          </span>

          {notification.linkUrl && (
            <span className="text-[11px] font-bold text-[#ff6900] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>{t('NOTIFICATION.VIEW_DETAILS', 'Xem chi tiết')}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Delete action button (hidden until hover) */}
      <button
        type="button"
        onClick={(e) => onDelete(notification.id, e)}
        aria-label={t('NOTIFICATION.DELETE', 'Xóa thông báo')}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0 absolute top-3 right-3"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
