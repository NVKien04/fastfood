import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { NOTIFICATION_KEYS } from '../constants/notification-keys';
import { NotificationItemData } from '@/features/notification/types';

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await ApiMain.instance.notification.markAsRead(id);
      if (res.kind !== 'OK') {
        throw new Error(res.error || 'Failed to mark notification as read');
      }
      return res.data;
    },
    onMutate: async (id: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      const previousNotifications = queryClient.getQueryData<NotificationItemData[]>(
        NOTIFICATION_KEYS.lists(),
      );

      if (previousNotifications) {
        queryClient.setQueryData<NotificationItemData[]>(
          NOTIFICATION_KEYS.lists(),
          previousNotifications.map((item) =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
        );
      }

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATION_KEYS.lists(), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await ApiMain.instance.notification.markAllAsRead();
      if (res.kind !== 'OK') {
        throw new Error(res.error || 'Failed to mark all notifications as read');
      }
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      const previousNotifications = queryClient.getQueryData<NotificationItemData[]>(
        NOTIFICATION_KEYS.lists(),
      );

      if (previousNotifications) {
        queryClient.setQueryData<NotificationItemData[]>(
          NOTIFICATION_KEYS.lists(),
          previousNotifications.map((item) => ({ ...item, isRead: true })),
        );
      }

      return { previousNotifications };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATION_KEYS.lists(), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await ApiMain.instance.notification.deleteNotification(id);
      if (res.kind !== 'OK') {
        throw new Error(res.error || 'Failed to delete notification');
      }
      return res.data;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      const previousNotifications = queryClient.getQueryData<NotificationItemData[]>(
        NOTIFICATION_KEYS.lists(),
      );

      if (previousNotifications) {
        queryClient.setQueryData<NotificationItemData[]>(
          NOTIFICATION_KEYS.lists(),
          previousNotifications.filter((item) => item.id !== id),
        );
      }

      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(NOTIFICATION_KEYS.lists(), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
    },
  });
};
