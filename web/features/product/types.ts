import {
  ProductDetailResponseDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';

export type CategoryGroup = {
  category: {
    id: number | string;
    name: string;
    slug: string;
  };
  products: ProductDetailResponseDto[];
};

export type {
  ProductDetailResponseDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
};
