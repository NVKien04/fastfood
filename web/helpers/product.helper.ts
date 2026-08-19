import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
  ProductIngredientResponseDto,
} from '@/services/apis/main/generated/data-contracts';

/**
 * Sắp xếp các biến thể theo giá chênh lệch tăng dần (từ thấp đến cao)
 */
export const sortProductVariants = (
  variants: ProductVariantResponseDto[] = [],
): ProductVariantResponseDto[] => {
  return [...variants].sort((a, b) => (a.modifiedPrice || 0) - (b.modifiedPrice || 0));
};

/**
 * Sắp xếp các nguyên liệu/topping theo giá tăng dần (từ thấp đến cao)
 */
export const sortProductIngredients = (
  ingredients: ProductIngredientResponseDto[] = [],
): ProductIngredientResponseDto[] => {
  return [...ingredients].sort((a, b) => (a.price || 0) - (b.price || 0));
};

/**
 * Tính đơn giá của sản phẩm gồm giá gốc + giá biến thể + giá topping
 */
export const calculateProductUnitPrice = (
  product: ProductDetailResponseDto | null,
  selectedVariant?: ProductVariantResponseDto | null,
  selectedIngredients: ProductIngredientResponseDto[] = [],
): number => {
  if (!product) return 0;
  const basePrice = product.basePrice || 0;
  const variantPrice = selectedVariant?.modifiedPrice || 0;
  const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
  return basePrice + variantPrice + ingredientsPrice;
};

/**
 * Tính tổng giá sản phẩm = Đơn giá * Số lượng
 */
export const calculateProductTotalPrice = (
  unitPrice: number,
  quantity: number,
): number => {
  return unitPrice * Math.max(1, quantity);
};

/**
 * Chuyển đổi tên danh mục thành slug URL (vd: "THỨC UỐNG" -> "thuc-uong", "PIZZA GIÁ ĐỈNH" -> "pizza-gia-dinh")
 */
export const categoryToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

