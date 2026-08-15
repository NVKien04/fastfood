import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CartResponseDto } from '@/services/apis/main/module/Cart.api';
import { CART_DETAIL } from '../constants/cart-keys';
import { Nullable } from '@/types';

export const useCartDetail = () => {
  const queryFn = async (): Promise<Nullable<CartResponseDto>> => {
    const response = await ApiMain.instance.cart.getCart();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [CART_DETAIL],
    queryFn,
  });
};
