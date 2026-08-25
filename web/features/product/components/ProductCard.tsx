'use client';

import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductDetailResponseDto } from '../types';
import { formatVND } from '@/utils';
import { isCustomizableProduct } from '@/helpers';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

type ProductCardProps = {
  product: ProductDetailResponseDto;
  onOpenDetail: (product: ProductDetailResponseDto) => void;
  onQuickAdd: (product: ProductDetailResponseDto, e: MouseEvent) => void;
};

export const ProductCard = ({ product, onOpenDetail, onQuickAdd }: ProductCardProps) => {
  const { t } = useTranslation();
  const hasOptions = isCustomizableProduct(product);
  const basePrice = Number(product.basePrice || 0);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const hasDiscount = Boolean(salePrice && salePrice > 0 && salePrice < basePrice);

  const currentPrice = hasDiscount ? (salePrice as number) : basePrice;
  const originalPrice = hasDiscount ? basePrice : 0;

  const handleClick = (e: MouseEvent) => {
    if (hasOptions) {
      onOpenDetail(product);
    } else {
      onQuickAdd(product, e);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-between h-full select-none cursor-pointer transition-all duration-300"
    >
      {/* 1. Product Image Container */}
      <div className="relative w-full aspect-square flex items-center justify-center p-2 sm:p-3">
        {/* Best Price / Featured Badge */}
        {product.isFeatured === 1 && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-white font-black text-[11px] sm:text-xs tracking-tight shadow-md bg-[#f97aa8] -rotate-6 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-12 select-none">
              best price
            </span>
          </div>
        )}

        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 rounded-full">
            <Utensils className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* 2. Product Title (Fixed height container for 1-line or 2-line titles) */}
      <div className="w-full min-h-[44px] flex items-center justify-center px-1 my-1.5">
        <h3 className="text-center font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#ff6900] dark:group-hover:text-[#ff6900] transition-colors">
          {product.name}
        </h3>
      </div>

      {/* 3. Price & Discount Action Area */}
      <div className="mt-auto w-full flex flex-col items-center justify-end min-h-[58px] gap-1.5 pb-1">
        {hasDiscount ? (
          <div className="flex items-center justify-center select-none leading-none">
            <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 line-through decoration-[#ff5c00] decoration-2">
              {formatVND(originalPrice)}
            </span>
          </div>
        ) : (
          <div className="h-4" aria-hidden="true" />
        )}

        {/* Price Pill Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => onQuickAdd(product, e)}
          className="h-auto px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100 text-xs sm:text-sm font-extrabold transition-all group-hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
        >
          <span>
            {hasOptions
              ? `${t('PRODUCT.PRICE_FROM')} ${formatVND(currentPrice)}`
              : formatVND(currentPrice)}
          </span>
        </Button>
      </div>
    </div>
  );
};

