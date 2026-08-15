import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { UploadImageResponseDto } from '@/services/apis/main/module/Upload.api';
import { Nullable } from '@/types';

export interface UploadImageVariables {
  file: File;
  folder?: string;
}

export const useUploadImage = () => {
  const mutationFn = async (params: UploadImageVariables): Promise<Nullable<UploadImageResponseDto>> => {
    const response = await ApiMain.instance.upload.uploadImage(params.file, params.folder || 'avatars');
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
  });
};
