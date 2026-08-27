'use client';

import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCheck, X } from 'lucide-react';
import { NotificationItemData, NotificationFilterTab } from '../types';
import { NotificationItem } from './NotificationItem';
import { NotificationEmpty } from './NotificationEmpty';

type NotificationDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItemData[];
  filteredNotifications: NotificationItemData[];
  unreadCount: number;
  activeTab: NotificationFilterTab;
  onTabChange: (tab: NotificationFilterTab) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string, e: MouseEvent) => void;
  onNotificationClick: (item: NotificationItemData) => void;
};

export const NotificationDropdown = ({
  isOpen,
  onClose,
  filteredNotifications,
  unreadCount,
  activeTab,
  onTabChange,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
}: NotificationDropdownProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const tabs: { id: NotificationFilterTab; label: string }[] = [
    { id: 'ALL', label: t('NOTIFICATION.TAB_ALL') },
    { id: 'UNREAD', label: t('NOTIFICATION.TAB_UNREAD') },
    { id: 'ORDER', label: t('NOTIFICATION.TAB_ORDER') },
    { id: 'PROMO', label: t('NOTIFICATION.TAB_PROMO') },
  ];

  return (
    <div className="absolute right-0 mt-2.5 w-87.5 sm:w-105 max-w-[calc(100vw-24px)] rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-2xl shadow-black/15 dark:shadow-black/60 z-50 overflow-hidden flex flex-col max-h-[560px] animate-in fade-in zoom-in-95 duration-150">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
              {t('NOTIFICATION.TITLE')}
            </h3>

            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#ff6900] text-white text-[11px] font-black shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#ff6900] dark:text-zinc-400 dark:hover:text-[#ff6900] h-auto py-1 px-2 rounded-lg cursor-pointer"
                title={t('NOTIFICATION.MARK_ALL_READ')}
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">{t('NOTIFICATION.MARK_ALL_READ')}</span>
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              className="size-7 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              aria-label={t('COMMON.CLOSE')}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tab Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'h-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0',
                  isSelected
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs hover:bg-gray-800 dark:hover:bg-zinc-100'
                    : 'bg-gray-100/80 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700',
                )}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
        {filteredNotifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          filteredNotifications.map((item) => (
            <NotificationItem key={item.id} notification={item} onClick={onNotificationClick} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};
