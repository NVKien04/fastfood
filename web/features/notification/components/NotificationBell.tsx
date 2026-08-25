'use client';

import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
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
      <button
        type="button"
        onClick={handleToggleOpen}
        aria-label={t('NAV.NOTIFICATIONS')}
        className={`relative p-2.5 rounded-full text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer select-none ${
          isOpen ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' : ''
        }`}
      >
        <Bell className="w-5 h-5" />

        {/* Unread Indicator Badge with Pulsing Ping */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6900] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6900]" />
          </span>
        )}
      </button>

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
