export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type OrderStatus = `${OrderStatusEnum}`;

export enum PaymentMethodEnum {
  COD = 'COD',
  BANKING = 'BANKING',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
}

export type PaymentMethod = `${PaymentMethodEnum}`;

export const DEFAULT_DELIVERY_FEE = 15000;
