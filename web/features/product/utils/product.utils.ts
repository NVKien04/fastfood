import { CategoryGroup, ProductDetailResponseDto } from '../types';
import { CategoryResponseDto } from '@/services/apis/main/module/Category.api';
import { categoryToSlug } from '@/helpers/product.helper';

export const filterProductsByQuery = (
  products: ProductDetailResponseDto[],
  searchQuery: string,
): ProductDetailResponseDto[] => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return products;

  return products.filter((p) => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
};

/**
 * Gom nhóm sản phẩm theo danh mục và lọc theo từ khóa tìm kiếm
 */
export const groupProductsByCategory = (
  products: ProductDetailResponseDto[],
  categories: CategoryResponseDto[],
  searchQuery: string,
  fallbackCategoryName: string = 'Thực đơn',
): CategoryGroup[] => {
  if (!products.length) return [];

  const filtered = filterProductsByQuery(products, searchQuery);

  if (categories.length > 0) {
    return categories
      .map((cat) => {
        const groupProducts = filtered.filter((p) => p.categoryId === cat.id);
        return {
          category: {
            id: cat.id,
            name: cat.name,
            slug: categoryToSlug(cat.name),
          },
          products: groupProducts,
        };
      })
      .filter((g) => g.products.length > 0);
  }

  // Fallback nếu không có danh sách category từ BE
  const groups: { [key: string]: CategoryGroup } = {};
  filtered.forEach((p) => {
    const catId = p.categoryId || 'uncategorized';
    const slug = categoryToSlug(fallbackCategoryName);

    if (!groups[catId]) {
      groups[catId] = {
        category: { id: catId, name: fallbackCategoryName, slug },
        products: [],
      };
    }
    groups[catId].products.push(p);
  });

  return Object.values(groups);
};

