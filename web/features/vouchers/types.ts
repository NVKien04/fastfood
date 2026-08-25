import { CouponItemDto } from '@/services/apis/main/module/Coupon.api';

export type VoucherFilterTab = 'ALL' | 'EXCLUSIVE' | 'DISCOUNT' | 'FREESHIP';

export type VoucherTabCounts = {
  ALL: number;
  EXCLUSIVE: number;
  DISCOUNT: number;
  FREESHIP: number;
};

export type { CouponItemDto };
