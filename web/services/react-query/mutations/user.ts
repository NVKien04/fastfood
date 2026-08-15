import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import {
  CreateAddressDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { USER_PROFILE } from '../constants/user-keys';
import { invalidateListQueries } from '../query-client';
import { Nullable } from '@/types';

export const useUserUpdateProfile = () => {
  const mutationFn = async (params: UpdateUserDto): Promise<Nullable<UserResponseDto>> => {
    const response = await ApiMain.instance.user.updateProfile(params);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([USER_PROFILE]);
      }
    },
  });
};

export const useUserAddAddress = () => {
  const mutationFn = async (params: CreateAddressDto): Promise<Nullable<unknown>> => {
    const response = await ApiMain.instance.user.addAddress(params);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([USER_PROFILE]);
      }
    },
  });
};

export const useUpdateProfile = useUserUpdateProfile;
export const useAddAddress = useUserAddAddress;
