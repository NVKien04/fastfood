import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CouponItemDto } from '@/services/apis/main/module/Coupon.api';
import { COUPON_ACTIVE, COUPON_MY_COUPONS } from '../constants/coupon-keys';
import { Nullable } from '@/types';

export const useActiveCoupons = () => {
  const queryFn = async (): Promise<Nullable<CouponItemDto[]>> => {
    const response = await ApiMain.instance.coupon.getActiveCoupons();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [COUPON_ACTIVE],
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMyCoupons = () => {
  const queryFn = async (): Promise<Nullable<CouponItemDto[]>> => {
    const response = await ApiMain.instance.coupon.getMyCoupons();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [COUPON_MY_COUPONS],
    queryFn,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
