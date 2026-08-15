'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, Utensils } from 'lucide-react';
import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
  ProductIngredientResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { formatVND } from '@/utils';
import {
  sortProductVariants,
  sortProductIngredients,
  calculateProductUnitPrice,
  calculateProductTotalPrice,
} from '@/helpers';

export type ProductDetailModalProps = {
  product: ProductDetailResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: {
    product: ProductDetailResponseDto;
    variant?: ProductVariantResponseDto | null;
    selectedIngredients?: ProductIngredientResponseDto[];
    quantity: number;
    totalPrice: number;
  }) => void;
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const { t } = useTranslation();
  const [selectedVariantId, setSelectedVariantId] = React.useState<number | null>(null);
  const [selectedIngredientIds, setSelectedIngredientIds] = React.useState<number[]>([]);
  const [quantity, setQuantity] = React.useState<number>(1);

  // Sắp xếp các biến thể theo giá chênh lệch tăng dần (từ thấp đến cao)
  const sortedVariants = React.useMemo(() => {
    return sortProductVariants(product?.variants);
  }, [product]);

  // Sắp xếp các nguyên liệu/topping theo giá tăng dần (từ thấp đến cao)
  const sortedIngredients = React.useMemo(() => {
    return sortProductIngredients(product?.ingredients);
  }, [product]);

  // Reset state khi sản phẩm thay đổi
  React.useEffect(() => {
    if (product) {
      setQuantity(1);
      if (sortedVariants.length > 0) {
        setSelectedVariantId(sortedVariants[0].id);
      } else {
        setSelectedVariantId(null);
      }
      setSelectedIngredientIds([]);
    }
  }, [product, sortedVariants]);

  const activeVariant = React.useMemo(() => {
    return sortedVariants.find((v) => v.id === selectedVariantId) || sortedVariants[0] || null;
  }, [sortedVariants, selectedVariantId]);

  const selectedIngredientsList = React.useMemo(() => {
    return sortedIngredients.filter((ing) => selectedIngredientIds.includes(ing.id));
  }, [sortedIngredients, selectedIngredientIds]);

  const unitPrice = React.useMemo(() => {
    return calculateProductUnitPrice(product, activeVariant, selectedIngredientsList);
  }, [product, activeVariant, selectedIngredientsList]);

  const totalPrice = React.useMemo(() => {
    return calculateProductTotalPrice(unitPrice, quantity);
  }, [unitPrice, quantity]);

  const _handleToggleIngredient = React.useCallback((id: number) => {
    setSelectedIngredientIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const _handleAddToCart = React.useCallback(() => {
    if (onAddToCart && product) {
      onAddToCart({
        product,
        variant: activeVariant,
        selectedIngredients: selectedIngredientsList,
        quantity,
        totalPrice,
      });
    }
    onClose();
  }, [onAddToCart, product, activeVariant, selectedIngredientsList, quantity, totalPrice, onClose]);

  if (!product) return null;

  const basePrice = product.basePrice || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        {/* Container Modal */}
        <div className="relative flex flex-col md:flex-row max-h-[85vh] overflow-y-auto md:overflow-hidden">
          {/* Nút đóng X */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-gray-100 text-gray-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cột Trái: Placeholder ảnh sản phẩm */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8 flex flex-col items-center justify-center text-center relative min-h-[240px] md:min-h-full border-b md:border-b-0 md:border-r border-orange-100/60">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-white/90 shadow-md border border-orange-100 flex flex-col items-center justify-center gap-2 p-4">
              <Utensils className="w-12 h-12 text-red-500/80" />
              <span className="text-xs font-medium text-gray-500 max-w-[120px] leading-tight">
                Tạm thời chưa có ảnh sản phẩm
              </span>
            </div>
            {product.isFeatured === 1 && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold px-3 py-1 shadow-sm">
                Nổi bật 🌟
              </Badge>
            )}
          </div>

          {/* Cột Phải: Các tùy chọn món ăn */}
          <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh]">
            <div>
              {/* Header Món ăn */}
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge
                    variant="destructive"
                    className="bg-red-600 text-xs px-2 py-0.5 font-bold uppercase tracking-wider"
                  >
                    Mới
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium">FastFood Choice</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h2>

                {product.description && (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* Phần 1: Danh sách Biến thể (Sắp xếp từ thấp đến cao) */}
              {sortedVariants.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-800 mb-3">{t('PRODUCT.SELECT_VARIANT', 'Chọn biến thể')}</label>
                  <div className="space-y-2.5">
                    {sortedVariants.map((variant) => {
                      const isSelected = activeVariant?.id === variant.id;
                      const variantTotalPrice = basePrice + (variant.modifiedPrice || 0);

                      return (
                        <label
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span className="text-sm font-medium text-gray-800">{variant.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{formatVND(variantTotalPrice)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Phần 2: Danh sách Topping / Nguyên liệu chọn thêm (Sắp xếp từ thấp đến cao) */}
              {sortedIngredients.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-800 mb-3">{t('PRODUCT.SELECT_TOPPINGS', 'Topping / Nguyên liệu chọn thêm')}</label>
                  <div className="space-y-2">
                    {sortedIngredients.map((ing) => {
                      const isChecked = selectedIngredientIds.includes(ing.id);

                      return (
                        <label
                          key={ing.id}
                          onClick={() => _handleToggleIngredient(ing.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-amber-500 bg-amber-50/50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-gray-800">{ing.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-600">+{formatVND(ing.price || 0)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Thanh thao tác dưới cùng (Stepper số lượng + Nút Thêm vào giỏ hàng) */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-4">
              {/* Nút tăng giảm số lượng */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 text-gray-600 hover:bg-white rounded-lg disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-bold text-sm text-gray-900">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 text-gray-600 hover:bg-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Nút Đỏ Thêm vào giỏ hàng */}
              <Button
                type="button"
                onClick={_handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl text-sm shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{t('PRODUCT.ADD_TO_CART', 'Thêm vào giỏ hàng')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span>{formatVND(totalPrice)}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
