import { OrderStatus, PaymentMethod } from '@/services/apis/main/generated/data-contracts';
import {
  OrderResponseDto,
  OrderStatsSummary,
  StatusConfigItem,
  NextStatusTransition,
} from '../types';

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfigItem> = {
  [OrderStatus.PENDING]: {
    key: OrderStatus.PENDING,
    label: 'ORDERS.PENDING',
    badgeVariant: 'secondary',
    badgeClassName: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium',
    iconName: 'clock',
  },
  [OrderStatus.CONFIRMED]: {
    key: OrderStatus.CONFIRMED,
    label: 'ORDERS.CONFIRMED',
    badgeVariant: 'default',
    badgeClassName: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 font-medium',
    iconName: 'check-circle',
  },
  [OrderStatus.PREPARING]: {
    key: OrderStatus.PREPARING,
    label: 'ORDERS.PREPARING',
    badgeVariant: 'outline',
    badgeClassName: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-medium',
    iconName: 'chef-hat',
  },
  [OrderStatus.READY_FOR_SHIPMENT]: {
    key: OrderStatus.READY_FOR_SHIPMENT,
    label: 'ORDERS.READY_FOR_SHIPMENT',
    badgeVariant: 'outline',
    badgeClassName: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-medium',
    iconName: 'truck',
  },
  [OrderStatus.DELIVERED]: {
    key: OrderStatus.DELIVERED,
    label: 'ORDERS.DELIVERED',
    badgeVariant: 'default',
    badgeClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium',
    iconName: 'package-check',
  },
  [OrderStatus.CANCELLED]: {
    key: OrderStatus.CANCELLED,
    label: 'ORDERS.CANCELLED',
    badgeVariant: 'destructive',
    badgeClassName: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium',
    iconName: 'x-circle',
  },
};

export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_SHIPMENT,
  OrderStatus.DELIVERED,
];

export const getStatusConfig = (status: OrderStatus): StatusConfigItem => {
  return (
    ORDER_STATUS_CONFIG[status] || {
      key: status,
      label: status,
      badgeVariant: 'secondary',
      badgeClassName: '',
      iconName: 'clock',
    }
  );
};

export const getValidNextTransitions = (currentStatus: OrderStatus): NextStatusTransition[] => {
  switch (currentStatus) {
    case OrderStatus.PENDING:
      return [
        {
          nextStatus: OrderStatus.CONFIRMED,
          label: 'Xác nhận đơn',
          description: 'Xác nhận tiếp nhận đơn hàng của khách',
          variant: 'default',
        },
      ];
    case OrderStatus.CONFIRMED:
      return [
        {
          nextStatus: OrderStatus.PREPARING,
          label: 'Bắt đầu làm món',
          description: 'Chuyển đơn xuống bộ phận bếp để chuẩn bị',
          variant: 'default',
        },
      ];
    case OrderStatus.PREPARING:
      return [
        {
          nextStatus: OrderStatus.READY_FOR_SHIPMENT,
          label: 'Sẵn sàng giao',
          description: 'Món ăn đã xong, sẵn sàng giao cho shipper',
          variant: 'default',
        },
      ];
    case OrderStatus.READY_FOR_SHIPMENT:
      return [
        {
          nextStatus: OrderStatus.DELIVERED,
          label: 'Hoàn tất giao hàng',
          description: 'Đã giao thành công cho khách hàng',
          variant: 'default',
        },
      ];
    default:
      return [];
  }
};

export const canCancelOrder = (status: OrderStatus): boolean => {
  return status === OrderStatus.PENDING || status === OrderStatus.CONFIRMED;
};

export const calculateOrderStats = (orders: OrderResponseDto[]): OrderStatsSummary => {
  const summary: OrderStatsSummary = {
    total: orders.length,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  };

  for (const order of orders) {
    if (order.status === OrderStatus.PENDING) {
      summary.pending += 1;
    } else if (
      order.status === OrderStatus.CONFIRMED ||
      order.status === OrderStatus.PREPARING ||
      order.status === OrderStatus.READY_FOR_SHIPMENT
    ) {
      summary.processing += 1;
    } else if (order.status === OrderStatus.DELIVERED) {
      summary.completed += 1;
      summary.revenue += order.total || 0;
    } else if (order.status === OrderStatus.CANCELLED) {
      summary.cancelled += 1;
    }
  }

  return summary;
};

export const getCustomerDisplayName = (order?: OrderResponseDto | null): string => {
  if (!order) return '—';
  return order.guestName || order.user?.name || 'Khách vãng lai';
};

export const getCustomerPhone = (order?: OrderResponseDto | null): string => {
  if (!order) return '—';
  return order.guestPhone || order.user?.phone || '—';
};

export const getCustomerEmail = (order?: OrderResponseDto | null): string => {
  if (!order) return '—';
  return order.user?.email || '—';
};

export const getDeliveryAddressText = (order?: OrderResponseDto | null): string => {
  if (!order) return '—';
  return order.guestAddress || 'Nhận tại cửa hàng / Chưa nhập địa chỉ';
};

export const getPaymentMethodLabel = (method?: PaymentMethod | null): string => {
  if (!method) return 'Chưa chọn';
  switch (method) {
    case PaymentMethod.COD:
      return 'Thanh toán khi nhận hàng (COD)';
    case PaymentMethod.ONLINE:
      return 'Thanh toán trực tuyến';
    default:
      return String(method);
  }
};

export const getPaymentStatusConfig = (
  paymentStatus?: string,
): { label: string; className: string } => {
  switch (paymentStatus?.toUpperCase()) {
    case 'PAID':
      return {
        label: 'Đã thanh toán',
        className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      };
    case 'PENDING':
      return {
        label: 'Chưa thanh toán',
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      };
    case 'FAILED':
      return {
        label: 'Thanh toán thất bại',
        className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      };
    case 'REFUNDED':
      return {
        label: 'Đã hoàn tiền',
        className: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        className: 'bg-muted text-muted-foreground border-border',
      };
    default:
      return {
        label: paymentStatus || 'Chưa xác định',
        className: 'bg-muted text-muted-foreground border-border',
      };
  }
};

export const formatOrderDateTime = (dateStr?: string | Date): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateStr);
  }
};

export const getTimeElapsedText = (dateStr?: string | Date): string => {
  if (!dateStr) return '';
  try {
    const past = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMinutes = Math.floor((now - past) / (1000 * 60));

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  } catch {
    return '';
  }
};

export interface QuickActionConfig {
  label: string;
  nextStatus: OrderStatus;
  className: string;
  iconName: 'check' | 'chef-hat' | 'truck' | 'package-check';
}

export const getQuickActionButtonConfig = (status: OrderStatus): QuickActionConfig | null => {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        label: 'ORDERS.QUICK_CONFIRM',
        nextStatus: OrderStatus.CONFIRMED,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs',
        iconName: 'check',
      };
    case OrderStatus.CONFIRMED:
      return {
        label: 'ORDERS.QUICK_PREPARE',
        nextStatus: OrderStatus.PREPARING,
        className: 'bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-2xs',
        iconName: 'chef-hat',
      };
    case OrderStatus.PREPARING:
      return {
        label: 'ORDERS.QUICK_READY',
        nextStatus: OrderStatus.READY_FOR_SHIPMENT,
        className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-2xs',
        iconName: 'truck',
      };
    case OrderStatus.READY_FOR_SHIPMENT:
      return {
        label: 'ORDERS.QUICK_DELIVER',
        nextStatus: OrderStatus.DELIVERED,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs',
        iconName: 'package-check',
      };
    default:
      return null;
  }
};

export interface KitchenBoardColumns {
  pending: OrderResponseDto[];
  preparing: OrderResponseDto[];
  shipping: OrderResponseDto[];
  completed: OrderResponseDto[];
}

export const groupOrdersForKitchen = (orders: OrderResponseDto[]): KitchenBoardColumns => {
  const result: KitchenBoardColumns = {
    pending: [],
    preparing: [],
    shipping: [],
    completed: [],
  };

  for (const order of orders) {
    if (order.status === OrderStatus.PENDING) {
      result.pending.push(order);
    } else if (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING) {
      result.preparing.push(order);
    } else if (order.status === OrderStatus.READY_FOR_SHIPMENT) {
      result.shipping.push(order);
    } else {
      result.completed.push(order);
    }
  }

  return result;
};

