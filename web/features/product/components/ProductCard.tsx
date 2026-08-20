'use client';

import { FC, MouseEvent } from 'react';
import { ProductDetailResponseDto } from '../types';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Utensils } from 'lucide-react';

type ProductCardProps = {
  product: ProductDetailResponseDto;
  onOpenDetail: (product: ProductDetailResponseDto) => void;
  onQuickAdd: (product: ProductDetailResponseDto, e: MouseEvent) => void;
};

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onQuickAdd,
}) => {
  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-100 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-full pt-[75%] bg-gray-50 overflow-hidden">
        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <Utensils className="w-12 h-12" />
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured === 1 && (
          <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
            Nổi bật
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Giá từ</span>
            <span className="text-base sm:text-lg font-black text-red-600">
              {formatVND(Number(product.basePrice))}
            </span>
          </div>

          <Button
            size="sm"
            onClick={(e) => onQuickAdd(product, e)}
            className="h-9 px-3.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs transition-colors shadow-xs group/btn"
          >
            <Plus className="w-4 h-4 mr-1 transition-transform group-hover/btn:rotate-90" />
            <span>Chọn</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
