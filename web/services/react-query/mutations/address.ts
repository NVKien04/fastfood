import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CreateAddressDto, UpdateAddressDto } from '@/services/apis/main/generated/data-contracts';
import { MY_ADDRESSES } from '../constants/address-keys';
import { invalidateListQueries } from '../query-client';

export const useCreateAddress = () => {
  return useMutation({
    mutationFn: async (params: CreateAddressDto) => {
      const response = await ApiMain.instance.address.create(params);
      if (response.kind !== 'OK') {
        throw new Error(response.error || 'Failed to create address');
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateListQueries([MY_ADDRESSES]);
    },
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAddressDto }) => {
      const response = await ApiMain.instance.address.update(id, data);
      if (response.kind !== 'OK') {
        throw new Error(response.error || 'Failed to update address');
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateListQueries([MY_ADDRESSES]);
    },
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ApiMain.instance.address.delete(id);
      if (response.kind !== 'OK') {
        throw new Error(response.error || 'Failed to delete address');
      }
      return response.data;
    },
    onSuccess: () => {
      invalidateListQueries([MY_ADDRESSES]);
    },
  });
};
