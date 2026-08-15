import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CategoryFilterDto, CategoryResponseDto } from '@/services/apis/main/module/Category.api';
import { CATEGORY_LIST } from '../constants/category-keys';
import { Nullable } from '@/types';

export const useCategoryList = (filter: CategoryFilterDto = { page: 1, limit: 100 }) => {
  const queryFn = async (): Promise<Nullable<CategoryResponseDto[]>> => {
    const response = await ApiMain.instance.category.getCategories(filter);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [CATEGORY_LIST, filter],
    queryFn,
  });
};
