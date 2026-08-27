import { OrderStatus } from '@/enums';

/**
 * Bảng chuyển trạng thái hợp lệ cho đơn hàng (State Machine).
 * Key = trạng thái hiện tại, Value = danh sách trạng thái có thể chuyển đến.
 */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_SHIPMENT],
  [OrderStatus.READY_FOR_SHIPMENT]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export const CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

/**
 * Mẫu Translation Key thông báo theo trạng thái đơn hàng (phục vụ đa ngôn ngữ i18n).
 */
export const STATUS_NOTIFICATIONS: Partial<Record<OrderStatus, { titleKey: string; contentKey: string }>> = {
  [OrderStatus.CONFIRMED]: {
    titleKey: 'NOTIFICATION.ORDER_CONFIRMED_TITLE',
    contentKey: 'NOTIFICATION.ORDER_CONFIRMED_CONTENT',
  },
  [OrderStatus.PREPARING]: {
    titleKey: 'NOTIFICATION.ORDER_PREPARING_TITLE',
    contentKey: 'NOTIFICATION.ORDER_PREPARING_CONTENT',
  },
  [OrderStatus.READY_FOR_SHIPMENT]: {
    titleKey: 'NOTIFICATION.ORDER_SHIPPING_TITLE',
    contentKey: 'NOTIFICATION.ORDER_SHIPPING_CONTENT',
  },
  [OrderStatus.DELIVERED]: {
    titleKey: 'NOTIFICATION.ORDER_DELIVERED_TITLE',
    contentKey: 'NOTIFICATION.ORDER_DELIVERED_CONTENT',
  },
  [OrderStatus.CANCELLED]: {
    titleKey: 'NOTIFICATION.ORDER_CANCELLED_TITLE',
    contentKey: 'NOTIFICATION.ORDER_CANCELLED_CONTENT',
  },
};
