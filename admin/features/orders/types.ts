import { OrderStatus, PaymentMethod } from '@/services/apis/main/generated/data-contracts';
import {
  OrderResponseDto,
  OrderItemResponseDto,
  OrderItemIngredientResponseDto,
} from '@/services/apis/main/module/Order.api';

export type { OrderResponseDto, OrderItemResponseDto, OrderItemIngredientResponseDto };
export { OrderStatus, PaymentMethod };

export type OrderFilterStatus = 'ALL' | OrderStatus;

export interface OrderFilterParams {
  page: number;
  limit: number;
  status: OrderFilterStatus;
  search: string;
}

export interface OrderStatsSummary {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

export interface StatusConfigItem {
  key: OrderStatus;
  label: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  badgeClassName: string;
  iconName: 'clock' | 'check-circle' | 'chef-hat' | 'truck' | 'package-check' | 'x-circle';
}

export interface NextStatusTransition {
  nextStatus: OrderStatus;
  label: string;
  description: string;
  variant: 'default' | 'outline' | 'secondary';
}
