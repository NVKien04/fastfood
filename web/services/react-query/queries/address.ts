import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { MY_ADDRESSES } from '../constants/address-keys';
import { AddressItemResponse } from '@/services/apis/main/module/Address.api';
import { useStore } from '@/stores';

export const useMyAddresses = () => {
  const accessToken = useStore((s) => s.accessToken);
  const isLoggedIn = !!accessToken;

  return useQuery<AddressItemResponse[]>({
    queryKey: [MY_ADDRESSES],
    queryFn: async () => {
      const response = await ApiMain.instance.address.getMyAddresses();
      if (response.kind !== 'OK') {
        throw new Error(response.error || 'Failed to fetch addresses');
      }
      return response.data || [];
    },
    enabled: isLoggedIn,
  });
};
