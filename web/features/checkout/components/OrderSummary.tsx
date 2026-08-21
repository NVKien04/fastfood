'use client';

import { FC } from 'react';
import Link from 'next/link';
import { formatVND } from '@/utils';
import { CartItem } from '@/stores';
import { ShoppingBag, Trash2, Plus, Minus, Utensils } from 'lucide-react';

type OrderSummaryProps = {
  items: CartItem[];
  subTotal: number;
  deliveryFee: number;
  total: number;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
};

export const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  subTotal,
  deliveryFee,
  total,
  updateQuantity,
  removeItem: _removeItem,
  clearCart,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/40 dark:shadow-black/40 sticky top-24 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-6">
        <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#ff6900]" />
          <span>Tóm tắt đơn hàng</span>
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      {items.length === 0 ? (
        <div className="py-8 text-center text-gray-400 dark:text-zinc-500">
          <Utensils className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-xs">Giỏ hàng của bạn đang trống</p>
          <Link href="/" className="inline-block mt-3 text-xs font-bold text-[#ff6900] hover:underline">
            ← Khám phá thực đơn
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 pb-3 border-b border-gray-50 dark:border-zinc-800/60 last:border-b-0"
            >
              {/* Product Thumbnail */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-100 dark:border-zinc-700 flex items-center justify-center">
                {item.product.img ? (
                  <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <Utensils className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{item.product.name}</h4>

                {item.variant && (
                  <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                    Phân loại: <span className="text-gray-700 dark:text-zinc-300">{item.variant.name}</span>
                  </div>
                )}

                {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                  <div className="text-[11px] text-gray-400 dark:text-zinc-500 truncate mt-0.5">
                    Topping: {item.selectedIngredients.map((ing) => ing.name).join(', ')}
                  </div>
                )}

                <div className="text-xs font-black text-[#ff6900] mt-1">{formatVND(item.totalPrice)}</div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-800/70 p-1 rounded-xl border border-gray-100 dark:border-zinc-700/60">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 shadow-xs transition-colors cursor-pointer"
                >
                  {item.quantity <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                </button>
                <span className="text-xs font-black text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-300 hover:text-[#ff6900] dark:hover:text-[#ff6900] shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-2.5 text-xs">
        <div className="flex justify-between text-gray-500 dark:text-zinc-400 font-medium">
          <span>Tiền món ăn:</span>
          <span className="text-gray-900 dark:text-white font-bold">{formatVND(subTotal)}</span>
        </div>

        <div className="flex justify-between text-gray-500 dark:text-zinc-400 font-medium">
          <span>Phí giao hàng:</span>
          <span className="text-gray-900 dark:text-white font-bold">{items.length > 0 ? formatVND(deliveryFee) : '0đ'}</span>
        </div>

        <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-zinc-800">
          <span>Tổng thanh toán:</span>
          <span className="text-lg font-black text-[#ff6900]">{items.length > 0 ? formatVND(total) : '0đ'}</span>
        </div>
      </div>
    </div>
  );
};
