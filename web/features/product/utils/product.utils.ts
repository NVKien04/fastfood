import { ProductDetailResponseDto } from '../types';

export const filterProductsByQuery = (
  products: ProductDetailResponseDto[],
  searchQuery: string,
): ProductDetailResponseDto[] => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return products;

  return products.filter(
    (p) =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query),
  );
};
