import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { UserFilterDto, UserResponseDto } from '@/services/apis/main/generated/data-contracts';
import { BaseResponse } from '@/services/apis/api.type';
import { USER_PROFILE, USER_LIST } from '../constants/user-keys';
import { Nullable } from '@/types';

export const useUserProfile = () => {
  const queryFn = async (): Promise<Nullable<UserResponseDto>> => {
    const response = await ApiMain.instance.user.getProfile();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [USER_PROFILE],
    queryFn,
  });
};

export const useUserList = (filter: UserFilterDto) => {
  const queryFn = async (): Promise<Nullable<BaseResponse<UserResponseDto[]>>> => {
    const response = await ApiMain.instance.user.getUserPage(filter);
    if (response.kind !== 'OK') return null;
    return response;
  };

  return useQuery({
    queryKey: [USER_LIST, filter],
    queryFn,
  });
};
