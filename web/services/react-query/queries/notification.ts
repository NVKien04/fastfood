import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { NOTIFICATION_KEYS } from '../constants/notification-keys';
import { mapApiNotificationToItem } from '@/helpers/notification.helper';
import { NotificationItemData } from '@/features/notification/types';

export const useNotificationListQuery = (enabled: boolean = true) => {
  const queryFn = async (): Promise<NotificationItemData[]> => {
    const res = await ApiMain.instance.notification.getNotifications();
    if (res.kind === 'OK' && Array.isArray(res.data)) {
      return res.data.map(mapApiNotificationToItem);
    }
    return [];
  };

  return useQuery({
    queryKey: NOTIFICATION_KEYS.lists(),
    queryFn,
    enabled,
    staleTime: 60 * 1000, // 60s Fresh state -> sau 60s dữ liệu mới thành Stale
    gcTime: 5 * 60 * 1000, // Lưu cache trong bộ nhớ 5 phút
    refetchOnWindowFocus: true, // Khi dữ liệu đã Stale, chỉ fetch lại khi người dùng tương tác / focus lại tab
    refetchOnMount: true,
  });
};
