'use client';

import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

type NotificationBellProps = {
  className?: string;
};

export const NotificationBell = ({ className = '' }: NotificationBellProps) => {
  const { t } = useTranslation();
  const {
    dropdownRef,
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    notifications,
    unreadCount,
    filteredNotifications,
    handleToggleOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleNotificationClick,
  } = useNotifications();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <Button
        variant="default"
        type="button"
        size="icon"
        onClick={handleToggleOpen}
        aria-label={t('NAV.NOTIFICATIONS')}
        className={`relative h-9 w-9 rounded-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800  cursor-pointer select-none transition-all active:scale-95`}
      >
        <Bell className="size-4.5 text-gray-600 dark:text-zinc-400" />

        {/* Unread Indicator Badge with Pulsing Ping */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6900] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]" />
          </span>
        )}
      </Button>

      {/* Dropdown Modal Container */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        filteredNotifications={filteredNotifications}
        unreadCount={unreadCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
};
