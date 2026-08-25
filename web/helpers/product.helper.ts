import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
  ProductIngredientResponseDto,
} from '@/services/apis/main/generated/data-contracts';

/**
 * Sắp xếp các biến thể theo giá chênh lệch tăng dần (từ thấp đến cao)
 */
export const sortProductVariants = (variants: ProductVariantResponseDto[] = []): ProductVariantResponseDto[] => {
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
  const rawProduct = product as ProductDetailResponseDto & {
    discountPrice?: number;
    salePrice?: number;
  };
  const effectiveBasePrice = Number(
    rawProduct.salePrice && rawProduct.salePrice > 0 && rawProduct.salePrice < Number(product.basePrice || 0)
      ? rawProduct.salePrice
      : (product.basePrice || 0),
  );
  const variantPrice = selectedVariant?.modifiedPrice || 0;
  const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
  return effectiveBasePrice + variantPrice + ingredientsPrice;
};

/**
 * Tính tổng giá sản phẩm = Đơn giá * Số lượng
 */
export const calculateProductTotalPrice = (unitPrice: number, quantity: number): number => {
  return unitPrice * Math.max(1, quantity);
};

/**
 * Kiểm tra xem sản phẩm có cần mở modal tùy chỉnh (Pizza, Combo, hoặc có nhiều biến thể/topping) hay không
 */
export const isCustomizableProduct = (product: {
  name?: string;
  variants?: unknown[];
  ingredients?: unknown[];
  categoryId?: number | string;
}): boolean => {
  if (!product) return false;
  if (product.variants && product.variants.length > 1) return true;
  if (product.ingredients && product.ingredients.length > 0) return true;

  const nameLower = (product.name || '').toLowerCase();
  if (nameLower.includes('pizza')) return true;
  if (nameLower.includes('combo')) return true;
  return false;
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

/**
 * Lấy translation key tương ứng cho tên hoặc slug của danh mục
 */
export const getCategoryTranslationKey = (nameOrSlug: string): string => {
  const norm = (nameOrSlug || '').toLowerCase().trim();
  if (norm.includes('roman')) return 'CATEGORY.ROMAN_PIZZA';
  if (norm.includes('pizza')) return 'CATEGORY.PIZZA';
  if (norm.includes('combo')) return 'CATEGORY.COMBO';
  if (norm.includes('khai vị') || norm.includes('khai-vi') || norm.includes('starter') || norm.includes('appetizer'))
    return 'CATEGORY.APPETIZERS';
  if (norm.includes('uống') || norm.includes('uong') || norm.includes('drink') || norm.includes('beverage'))
    return 'CATEGORY.DRINKS';
  if (norm.includes('cà phê') || norm.includes('ca-phe') || norm.includes('coffee') || norm.includes('tea'))
    return 'CATEGORY.COFFEE';
  if (norm.includes('mỳ') || norm.includes('my-y') || norm.includes('pasta') || norm.includes('spaghetti'))
    return 'CATEGORY.PASTA';
  if (norm.includes('snack') || norm.includes('ăn vặt') || norm.includes('an-vat')) return 'CATEGORY.SNACKS';
  if (norm.includes('gà') || norm.includes('chicken')) return 'CATEGORY.CHICKEN';
  if (norm.includes('trẻ em') || norm.includes('kid')) return 'CATEGORY.KIDS';
  if (norm.includes('tráng miệng') || norm.includes('dessert')) return 'CATEGORY.DESSERT';
  if (norm.includes('chay') || norm.includes('vegan') || norm.includes('vegetarian')) return 'CATEGORY.VEGETARIAN';
  return '';
};

/**
 * Format tên danh mục chuẩn chữ hoa đầu từ nếu không có i18n
 */
export const formatCategoryName = (name: string): string => {
  if (!name) return '';
  if (name === name.toUpperCase() && name.length > 2) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return name;
};

