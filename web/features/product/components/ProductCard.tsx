'use client';

import { FC, MouseEvent } from 'react';
import { ProductDetailResponseDto } from '../types';
import { formatVND } from '@/utils';
import { isCustomizableProduct } from '@/helpers';
import { Utensils } from 'lucide-react';

type ProductCardProps = {
  product: ProductDetailResponseDto;
  onOpenDetail: (product: ProductDetailResponseDto) => void;
  onQuickAdd: (product: ProductDetailResponseDto, e: MouseEvent) => void;
};

export const ProductCard: FC<ProductCardProps> = ({ product, onOpenDetail, onQuickAdd }) => {
  const hasOptions = isCustomizableProduct(product);

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
      className="group relative flex flex-col items-center select-none cursor-pointer transition-all duration-300"
    >
      {/* 1. Product Image Container */}
      <div className="relative w-full aspect-square flex items-center justify-center p-2 sm:p-3">
        {/* Flat Best Price Pill Badge (rgb(249, 122, 168)) */}
        {product.isFeatured === 1 && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10 -rotate-[10deg] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-[12deg] pointer-events-none">
            <div
              style={{ backgroundColor: 'rgb(249, 122, 168)' }}
              className="px-3.5 sm:px-4 py-1 rounded-full text-white font-black text-xs sm:text-sm tracking-tight text-center whitespace-nowrap shadow-xs select-none"
            >
              best price
            </div>
          </div>
        )}

        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 rounded-full">
            <Utensils className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* 2. Product Title */}
      <h3 className="text-center font-bold text-sm sm:text-base text-gray-900 dark:text-white mt-2 sm:mt-3 line-clamp-2 px-1 group-hover:text-[#ff6900] dark:group-hover:text-[#ff6900] transition-colors">
        {product.name}
      </h3>

      {/* 3. Price Pill Button */}
      <button
        type="button"
        onClick={(e) => onQuickAdd(product, e)}
        className="mt-2.5 sm:mt-3 inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-100 dark:bg-[#252528] hover:bg-gray-200 dark:hover:bg-[#323236] text-gray-900 dark:text-zinc-100 text-xs sm:text-sm font-extrabold transition-all group-hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
      >
        <span>
          {hasOptions ? `từ ${formatVND(Number(product.basePrice))}` : formatVND(Number(product.basePrice))}
        </span>
      </button>
    </div>
  );
};
