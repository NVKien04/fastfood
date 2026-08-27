'use client';

import { MouseEvent } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Package,
  TicketPercent,
  User,
  Settings,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { NotificationItemData } from '../types';
import {
  formatNotificationTime,
  getNotificationTypeMeta,
  renderNotificationText,
} from '../utils/notification.helper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NotificationItemProps = {
  notification: NotificationItemData;
  onClick: (item: NotificationItemData) => void;
  onDelete: (id: string, e: MouseEvent) => void;
};

export const NotificationItem = ({ notification, onClick, onDelete }: NotificationItemProps) => {
  const { t } = useTranslation();
  const timeString = formatNotificationTime(notification.createdAt, t);
  const typeMeta = getNotificationTypeMeta(notification.type);

  // Render clean, minimalist icon without excessive colors/gradients
  const renderVisual = () => {
    if (notification.img) {
      return (
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700/80">
          <Image src={notification.img} alt={notification.title} fill sizes="40px" className="object-cover" />
        </div>
      );
    }

    switch (notification.type) {
      case 'ORDER':
        return (
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-gray-200/60 dark:border-zinc-700/60">
            <Package className="w-5 h-5" />
          </div>
        );
      case 'PROMO':
        return (
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-zinc-800 text-[#ff6900] flex items-center justify-center shrink-0 border border-orange-100 dark:border-zinc-700/60">
            <TicketPercent className="w-5 h-5" />
          </div>
        );
      case 'ACCOUNT':
        return (
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-gray-200/60 dark:border-zinc-700/60">
            <User className="w-5 h-5" />
          </div>
        );
      case 'SYSTEM':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-gray-200/60 dark:border-zinc-700/60">
            <Settings className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={cn(
        'group relative p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer select-none flex items-start gap-3.5 border',
        notification.isRead
          ? 'bg-white dark:bg-zinc-900/60 border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/60 hover:border-gray-100 dark:hover:border-zinc-800'
          : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-100/70 dark:border-orange-900/30 hover:bg-orange-50/70 dark:hover:bg-orange-950/40',
      )}
    >
      {/* Category Visual / Image */}
      {renderVisual()}

      {/* Content Area */}
      <div className="flex-1 min-w-0 pr-5">
        {/* Top Tag & Time */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider', typeMeta.tagClass)}>
            {t(typeMeta.tagKey)}
          </span>
          {!notification.isRead && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#ff6900] shrink-0"
              title={t('NOTIFICATION.UNREAD')}
            />
          )}
          <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">
            • {timeString}
          </span>
        </div>

        {/* Title */}
        <h5
          className={cn(
            'text-xs sm:text-[13px] line-clamp-1 tracking-tight mb-1',
            notification.isRead
              ? 'font-bold text-gray-800 dark:text-zinc-200'
              : 'font-black text-gray-900 dark:text-white',
          )}
        >
          {renderNotificationText(notification.title, t)}
        </h5>

        {/* Message */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-2">
          {renderNotificationText(notification.message, t)}
        </p>

        {/* Bottom Link Action */}
        {notification.linkUrl && (
          <div className="flex items-center justify-end">
            <span className="text-[11px] font-extrabold text-[#ff6900] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>{t('NOTIFICATION.VIEW_DETAILS')}</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>

      {/* Delete action button (hidden until hover) */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={(e) => onDelete(notification.id, e)}
        aria-label={t('NOTIFICATION.DELETE')}
        className="opacity-0 group-hover:opacity-100 size-7 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0 absolute top-2.5 right-2.5"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
};
