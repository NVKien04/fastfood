'use client';

import { useState, useMemo, useCallback, useEffect, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores';
import { NotificationItemData, NotificationFilterTab } from '../types';
import { useNotificationListQuery } from '@/services/react-query/queries/notification';
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '@/services/react-query/mutations/notification';

export const useNotifications = () => {
  const router = useRouter();
  const accessToken = useStore((s) => s.accessToken);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('ALL');

  // TanStack Query với staleTime: 60s
  // Trong 60s đầu, dữ liệu ở trạng thái Fresh (không gọi lại API)
  // Sau 60s, dữ liệu chuyển sang Stale và chỉ gọi lại API khi có tương tác người dùng (focus window, mở dropdown, refetch)
  const { data: apiNotifications, isLoading, refetch } = useNotificationListQuery(Boolean(accessToken));

  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  // Danh sách thông báo hiển thị (lấy từ Query hoặc mock nếu chưa đăng nhập)
  const notifications: NotificationItemData[] = useMemo(() => {
    if (accessToken) {
      return apiNotifications || [];
    }
    return [];
  }, [accessToken, apiNotifications]);

  // Đóng dropdown khi click bên ngoài hoặc bấm phím Escape
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'UNREAD':
        return notifications.filter((n) => !n.isRead);
      case 'ORDER':
        return notifications.filter((n) => n.type === 'ORDER');
      case 'PROMO':
        return notifications.filter((n) => n.type === 'PROMO');
      case 'ALL':
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      // Khi người dùng mở dropdown và dữ liệu đã Stale, có thể kích hoạt refetch
      if (next && accessToken) {
        refetch();
      }
      return next;
    });
  }, [accessToken, refetch]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      if (accessToken) {
        markAsReadMutation.mutate(id);
      }
    },
    [accessToken, markAsReadMutation],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (accessToken) {
      markAllAsReadMutation.mutate();
    }
  }, [accessToken, markAllAsReadMutation]);

  const handleDelete = useCallback(
    async (id: string, e?: MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (accessToken) {
        deleteNotificationMutation.mutate(id);
      }
    },
    [accessToken, deleteNotificationMutation],
  );

  const handleNotificationClick = useCallback(
    (item: NotificationItemData) => {
      if (!item.isRead) {
        handleMarkAsRead(item.id);
      }

      if (item.linkUrl) {
        setIsOpen(false);
        router.push(item.linkUrl);
      }
    },
    [handleMarkAsRead, router],
  );

  return {
    dropdownRef,
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    notifications,
    unreadCount,
    filteredNotifications,
    isLoading,
    refetch,
    handleToggleOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleNotificationClick,
  };
};
