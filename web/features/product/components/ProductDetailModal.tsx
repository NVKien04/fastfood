'use client';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, Utensils } from 'lucide-react';
import { ProductDetailResponseDto } from '../types';
import { formatVND } from '@/utils';
import { useProductDetailModal } from '../hooks/useProductDetailModal';

export type ProductDetailModalProps = {
  product: ProductDetailResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ProductDetailModal: FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const {
    sortedVariants,
    sortedIngredients,
    selectedVariantId,
    setSelectedVariantId,
    selectedIngredientIds,
    handleToggleIngredient,
    quantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    unitPrice,
    totalPrice,
    handleAddToCart,
  } = useProductDetailModal(product, onClose);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white">
        {/* Header with Title and Close Button */}
        <DialogHeader className="p-4 sm:p-6 pb-2 border-b border-gray-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex flex-col text-left">
            <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {product.name}
            </DialogTitle>
            <span className="text-sm font-bold text-red-600 mt-0.5">
              {formatVND(unitPrice)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('COMMON.CLOSE', 'Đóng')}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Product Image and Description */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-gray-100">
              {product.img ? (
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Utensils className="w-16 h-16" />
                </div>
              )}
            </div>
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Variants Selection */}
          {sortedVariants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-wider text-gray-900">
                  {t('PRODUCT.SELECT_VARIANT', 'Chọn kích thước / phân loại')}
                </span>
                <Badge variant="outline" className="text-[10px] text-gray-400">
                  Bắt buộc
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sortedVariants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const priceDiff = Number(variant.modifiedPrice || 0);

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 text-red-900 shadow-xs'
                          : 'border-gray-100 hover:border-gray-200 bg-white text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-red-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                        <span className="text-xs sm:text-sm font-bold">{variant.name}</span>
                      </div>
                      {priceDiff !== 0 && (
                        <span className="text-xs font-semibold text-gray-500">
                          {priceDiff > 0 ? `+${formatVND(priceDiff)}` : `-${formatVND(Math.abs(priceDiff))}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients / Toppings Selection */}
          {sortedIngredients.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-wider text-gray-900">
                  {t('PRODUCT.SELECT_TOPPINGS', 'Chọn thêm topping & gia vị')}
                </span>
                <Badge variant="outline" className="text-[10px] text-gray-400">
                  Tùy chọn
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sortedIngredients.map((ingredient) => {
                  const isSelected = selectedIngredientIds.includes(ingredient.id);
                  const priceDiff = Number(ingredient.price || 0);

                  return (
                    <button
                      key={ingredient.id}
                      type="button"
                      onClick={() => handleToggleIngredient(ingredient.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 text-red-900 shadow-xs'
                          : 'border-gray-100 hover:border-gray-200 bg-white text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </div>
                        <span className="text-xs sm:text-sm font-bold">{ingredient.name}</span>
                      </div>
                      {priceDiff > 0 && (
                        <span className="text-xs font-semibold text-gray-500">
                          +{formatVND(priceDiff)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Quantity & Add to Cart Action */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
          {/* Quantity Controls */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-sm w-8 text-center text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncreaseQuantity}
              aria-label="Tăng số lượng"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full sm:flex-1 h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 text-sm flex items-center justify-between px-6 transition-all"
          >
            <span>{t('PRODUCT.ADD_TO_CART', 'Thêm vào giỏ hàng')}</span>
            <span>{formatVND(totalPrice)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
