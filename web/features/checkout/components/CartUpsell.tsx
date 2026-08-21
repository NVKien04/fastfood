'use client';

import { FC, useMemo } from 'react';
import { useProductList } from '@/services/react-query/queries/product';
import { useStore } from '@/stores';
import { formatVND } from '@/utils';
import { Plus, Sparkles, Utensils } from 'lucide-react';
import { ProductDetailResponseDto } from '@/services/apis/main/generated/data-contracts';

export const CartUpsell: FC = () => {
  const addItem = useStore((s) => s.addItem);
  const { data: productsData } = useProductList({ page: 1, limit: 30 });

  const upsellProducts = useMemo(() => {
    if (!productsData || productsData.kind !== 'OK' || !productsData.data) return [];
    // Filter items that look like drinks, snacks, or dessert
    const list = productsData.data;
    const drinksAndSnacks = list.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return (
        name.includes('trà') ||
        name.includes('nước') ||
        name.includes('tea') ||
        name.includes('drink') ||
        name.includes('kem') ||
        name.includes('khoai') ||
        desc.includes('uống') ||
        desc.includes('trà')
      );
    });

    if (drinksAndSnacks.length >= 2) return drinksAndSnacks.slice(0, 6);
    return list.slice(0, 6);
  }, [productsData]);

  const handleQuickAdd = (product: ProductDetailResponseDto) => {
    addItem({
      product,
      variant: product.variants?.[0] || null,
      selectedIngredients: [],
      quantity: 1,
    });
  };

  if (upsellProducts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#ff6900]" />
        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
          Bạn sẽ thích
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {upsellProducts.slice(0, 2).map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-950/70 border border-gray-100 dark:border-zinc-800/80 hover:border-orange-200 dark:hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700 shadow-xs">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Utensils className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate mt-0.5 max-w-[150px]">
                  {product.description || 'Món ăn kèm thơm ngon'}
                </p>
                <div className="text-xs font-black text-gray-900 dark:text-zinc-100 mt-1">
                  {formatVND(product.basePrice || 0)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickAdd(product)}
              className="w-8 h-8 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 transition-transform cursor-pointer shrink-0 ml-2"
              title="Thêm vào giỏ"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
