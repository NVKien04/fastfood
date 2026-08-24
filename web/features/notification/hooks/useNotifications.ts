'use client';

import { useState, useMemo, useCallback, useEffect, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';
import { NotificationItemData, NotificationFilterTab } from '../types';
import { INITIAL_MOCK_NOTIFICATIONS } from '../utils/mock-notifications';

const STORAGE_KEY = 'keipizza_notifications_v1';

export const useNotifications = () => {
  const router = useRouter();
  const accessToken = useStore((s) => s.accessToken);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('ALL');
  const [notifications, setNotifications] = useState<NotificationItemData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore storage error
      }
    }
    return INITIAL_MOCK_NOTIFICATIONS;
  });

  // Save to localStorage when notifications change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch {
        // ignore
      }
    }
  }, [notifications]);

  // Fetch from API if logged in
  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const fetchApiNotifications = async () => {
      try {
        const res = await ApiMain.instance.notification.getNotifications();
        if (isMounted && res.kind === 'OK' && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: NotificationItemData[] = res.data.map((item) => ({
            id: String(item.id),
            title: item.title,
            message: item.message,
            type: item.type || 'SYSTEM',
            isRead: Boolean(item.isRead),
            createdAt: item.createdAt || new Date().toISOString(),
            linkUrl: item.linkUrl,
          }));
          setNotifications(mapped);
        }
      } catch {
        // Fallback to local mock data on error
      }
    };

    fetchApiNotifications();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  // Close dropdown on click outside or Escape
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
    setIsOpen((prev) => !prev);
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );

      if (accessToken) {
        try {
          await ApiMain.instance.notification.markAsRead(id);
        } catch {
          // ignore
        }
      }
    },
    [accessToken],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    if (accessToken) {
      try {
        await ApiMain.instance.notification.markAllAsRead();
      } catch {
        // ignore
      }
    }
  }, [accessToken]);

  const handleDelete = useCallback(
    async (id: string, e?: MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      setNotifications((prev) => prev.filter((item) => item.id !== id));

      if (accessToken) {
        try {
          await ApiMain.instance.notification.deleteNotification(id);
        } catch {
          // ignore
        }
      }
    },
    [accessToken],
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
    handleToggleOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleNotificationClick,
  };
};
