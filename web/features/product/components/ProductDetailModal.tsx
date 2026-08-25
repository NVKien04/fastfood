'use client';

import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, Utensils, Loader2, Info, Check } from 'lucide-react';
import { ProductDetailResponseDto } from '../types';
import { CartItem } from '@/stores';
import { formatVND } from '@/utils';
import { useProductDetailModal } from '../hooks/useProductDetailModal';

export type ProductDetailModalProps = {
  product: ProductDetailResponseDto | null;
  isOpen: boolean;
  isLoading?: boolean;
  cartItem?: CartItem | null;
  onClose: () => void;
};

export const ProductDetailModal = ({
  product,
  isOpen,
  isLoading = false,
  cartItem = null,
  onClose,
}: ProductDetailModalProps) => {
  const { t } = useTranslation();

  const {
    isEditMode,
    sortedVariants,
    sortedIngredients,
    selectedVariantId,
    activeVariant,
    imageScale,
    productSpecsText,
    setSelectedVariantId,
    selectedIngredientIds,
    handleToggleIngredient,
    quantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    totalPrice,
    handleAddToCart,
  } = useProductDetailModal(product, onClose, cartItem);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl md:max-w-4xl lg:max-w-5xl w-[95vw] max-h-[92vh] md:h-[640px] p-0 overflow-hidden rounded-3xl border border-gray-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white shadow-2xl flex flex-col md:flex-row focus:outline-none"
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: Pizza Showcase with Interactive Scale Animation */}
        {/* ============================================================ */}
        <div className="md:w-1/2 lg:w-[52%] bg-[#fafaf8] dark:bg-[#121215] relative flex flex-col items-center justify-center p-6 sm:p-10 select-none overflow-hidden min-h-[260px] md:min-h-full border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800/80">
          {/* Subtle background glow */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          {/* Product Image */}
          <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
            {product.img ? (
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out"
                style={{ transform: `scale(${imageScale})` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-800/50 rounded-full">
                <Utensils className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {product.isFeatured === 1 && (
            <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
              {t('PRODUCT.FEATURED')}
            </Badge>
          )}
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Customization, Variant Tabs & Topping Grid     */}
        {/* ============================================================ */}
        <div className="md:w-1/2 flex flex-col justify-between h-full bg-white dark:bg-[#18181b] overflow-hidden">
          {/* 1. Header with Title and Close Button */}
          <div className="p-5 sm:p-6 pb-3 border-b border-gray-100 dark:border-zinc-800/60 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                  {product.name}
                </DialogTitle>
                <button
                  type="button"
                  aria-label={t('PRODUCT.INFO')}
                  className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Subtitle / Specs (Size & Crust) */}
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-1">
                {productSpecsText || (product.description ? product.description.slice(0, 60) : t('PRODUCT.DEFAULT_DESC'))}
              </p>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('COMMON.CLOSE')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Scrollable Body: Variants + Toppings */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
            {/* Loading Indicator for Detail Refetch */}
            {isLoading && (
              <div className="flex items-center justify-center py-4 text-xs text-gray-500 dark:text-zinc-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#ff5c00]" />
                <span>{t('PRODUCT.LOADING_OPTIONS')}</span>
              </div>
            )}

            {/* Segmented Variant Selector (Pills matching Dodo Pizza style) */}
            {!isLoading && sortedVariants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  {t('PRODUCT.SELECT_SIZE')}
                </h4>

                <div className="bg-gray-100/90 dark:bg-[#27272a]/80 p-1.5 rounded-2xl flex items-center gap-1.5 border border-gray-200/80 dark:border-zinc-800/80">
                  {sortedVariants.map((variant) => {
                    const isSelected = activeVariant?.id === variant.id || selectedVariantId === variant.id;
                    const basePrice = sortedVariants[0]?.modifiedPrice || 0;
                    const priceDiff = (variant.modifiedPrice || 0) - basePrice;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 select-none cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm font-extrabold scale-[1.02]'
                            : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-zinc-700/50'
                        }`}
                      >
                        <span className="truncate">{variant.name}</span>
                        {priceDiff !== 0 && (
                          <span
                            className={`text-[10px] font-semibold ${isSelected ? 'text-orange-500' : 'text-gray-500 dark:text-zinc-500'}`}
                          >
                            {priceDiff > 0 ? `+${formatVND(priceDiff)}` : `-${formatVND(Math.abs(priceDiff))}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Taste (Ingredients & Toppings Grid) */}
            {!isLoading && sortedIngredients.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                  {t('PRODUCT.ADD_TO_TASTE')}
                </h4>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {sortedIngredients.map((ingredient) => {
                    const isSelected = selectedIngredientIds.some((id) => Number(id) === Number(ingredient.id));
                    const price = Number(ingredient.price || 0);

                    return (
                      <button
                        key={ingredient.id}
                        type="button"
                        onClick={() => handleToggleIngredient(ingredient.id)}
                        className={`relative p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between text-center select-none group cursor-pointer ${
                          isSelected
                            ? 'border-[#ff5c00] bg-orange-50/40 dark:bg-orange-950/20 shadow-md shadow-[#ff5c00]/10 ring-2 ring-[#ff5c00]'
                            : 'border-gray-200/80 dark:border-zinc-800/90 bg-white dark:bg-[#27272a]/50 hover:bg-gray-50 dark:hover:bg-[#27272a] hover:border-gray-300 dark:hover:border-zinc-700 shadow-xs'
                        }`}
                      >
                        {/* Checkmark indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#ff5c00] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Ingredient Image */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center my-1">
                          {ingredient.imageUrl ? (
                            <img
                              src={ingredient.imageUrl}
                              alt={ingredient.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-xs"
                            />
                          ) : (
                            <Utensils className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                          )}
                        </div>

                        {/* Ingredient Name */}
                        <span className="text-[11px] font-bold text-gray-800 dark:text-zinc-200 line-clamp-2 h-[28px] leading-tight mt-1 group-hover:text-gray-950 dark:group-hover:text-white flex items-center justify-center">
                          {ingredient.name}
                        </span>

                        {/* Price */}
                        <span className="text-[11px] font-extrabold text-gray-600 dark:text-zinc-400 mt-0.5">
                          {price > 0 ? formatVND(price) : t('PRODUCT.FREE')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Bottom Sticky Action Bar */}
          <div className="p-4 sm:p-6 pt-3 bg-white dark:bg-[#18181b] border-t border-gray-100 dark:border-zinc-800/80 flex items-center gap-3">
            {/* Quantity Controls Pill */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#27272a] p-1.5 rounded-2xl border border-gray-200/80 dark:border-zinc-700/60 shadow-xs shrink-0">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                aria-label={t('PRODUCT.DECREASE_QTY')}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm w-6 text-center text-gray-900 dark:text-white">{quantity}</span>
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                aria-label={t('PRODUCT.INCREASE_QTY')}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* High-Impact CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 sm:h-13 bg-[#ff5c00] hover:bg-[#e05200] active:scale-[0.99] text-white font-black rounded-2xl shadow-xl shadow-[#ff5c00]/25 text-sm sm:text-base flex items-center justify-center px-4 transition-all cursor-pointer"
            >
              <span>
                {isEditMode
                  ? `${t('COMMON.SAVE')} • ${formatVND(totalPrice)}`
                  : t('PRODUCT.ADD_TO_CART_PRICE', {
                      price: formatVND(totalPrice),
                      defaultValue: `Thêm vào giỏ với ${formatVND(totalPrice)}`,
                    })}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
