import { OrderResponseDto } from '@/services/apis/main/module/Order.api';

export type OrderFilterTab = 'ALL' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

export type OrderTabCounts = {
  ALL: number;
  PROCESSING: number;
  DELIVERED: number;
  CANCELLED: number;
};

export type { OrderResponseDto };
