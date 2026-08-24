'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CartItem } from '@/stores';
import { formatVND } from '@/utils';
import { Trash2, Plus, Minus, Utensils, ChevronRight, Ticket, Sparkles, Info, Edit3, X } from 'lucide-react';
import { CartUpsell } from './CartUpsell';
import { VoucherModal, VoucherItem } from './VoucherModal';
import { ProductDetailModal } from '@/features/product/components/ProductDetailModal';

type CartReviewSectionProps = {
  items: CartItem[];
  subTotal: number;
  deliveryFee: number;
  total: number;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  onProceedToCheckout: () => void;
};

export const CartReviewSection = ({
  items,
  subTotal,
  deliveryFee,
  total,
  updateQuantity,
  removeItem,
  clearCart,
  onProceedToCheckout,
}: CartReviewSectionProps) => {
  const { t } = useTranslation();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [needCutlery, setNeedCutlery] = useState<boolean>(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const voucherDiscount = selectedVoucher ? selectedVoucher.discountAmount : 0;
  const finalTotal = items.length > 0 ? Math.max(0, total - voucherDiscount) : 0;
  const rewardPoints = Math.floor(finalTotal / 10000);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Cart Items & Upsell "Bạn sẽ thích"              */}
        {/* ============================================================ */}
        <div className="lg:col-span-6">
          {/* Main Cart Items Box */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/40 dark:shadow-black/40 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-zinc-200">
                {t('CART.ITEMS_IN_CART', {
                  count: totalCount,
                  defaultValue: `Có ${totalCount} sản phẩm trong giỏ hàng của bạn`,
                })}
              </h2>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('CART.CLEAR_ALL', 'Xóa hết')}</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-zinc-500">
                <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  {t('CART.EMPTY_TITLE', 'Giỏ hàng của bạn đang trống')}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  {t('CART.EMPTY_DESC', 'Hãy chọn những món ăn ngon từ thực đơn')}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full bg-[#ff6900] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:bg-[#e05d00] transition-colors"
                >
                  ← {t('CART.VIEW_MENU', 'Khám phá thực đơn ngay')}
                </Link>
              </div>
            ) : (
              /* Item List */
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-50/50 dark:bg-zinc-800 p-1.5 shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700">
                      {item.product.img ? (
                        <img src={item.product.img} alt={item.product.name} className="w-full h-full object-contain" />
                      ) : (
                        <Utensils className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight">
                        {item.product.name}
                      </h3>

                      {/* Variant (Size, Crust) */}
                      {item.variant && (
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                          {t('CART.SIZE_LABEL', 'Cỡ:')}{' '}
                          <span className="text-gray-800 dark:text-zinc-200 font-semibold">{item.variant.name}</span>
                        </p>
                      )}

                      {/* Toppings / Ingredients */}
                      {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">
                          {t('CART.TOPPING_LABEL', 'Topping:')} {item.selectedIngredients.map((i) => i.name).join(', ')}
                        </p>
                      )}

                      {/* Change / Edit Item Button */}
                      {item.product.variants?.length || item.product.ingredients?.length ? (
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#ff6900] hover:text-[#e05d00] hover:underline cursor-pointer select-none"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{t('CART.EDIT_ITEM', 'Sửa món')}</span>
                        </button>
                      ) : null}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                        {formatVND(item.totalPrice)}
                      </span>

                      {/* Quantity Pill Controls */}
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-800/80 p-1 rounded-xl border border-gray-100 dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={() =>
                            item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)
                          }
                          aria-label={t('PRODUCT.DECREASE_QTY', 'Giảm số lượng')}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-300 hover:text-[#ff6900] shadow-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-gray-900 dark:text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={t('PRODUCT.INCREASE_QTY', 'Tăng số lượng')}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-300 hover:text-[#ff6900] dark:hover:text-[#ff6900] shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Delete item button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-105 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 self-center"
                      title={t('CART.REMOVE_ITEM_TITLE', 'Xóa món ăn')}
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upsell Section */}
            <CartUpsell />
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Voucher, Special Deals, Pricing & Checkout CTA */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 h-fit">
          {/* 1. Voucher Card */}
          <div
            onClick={() => setIsVoucherModalOpen(true)}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/30 dark:shadow-black/30 transition-all cursor-pointer hover:border-orange-200 dark:hover:border-zinc-700 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    selectedVoucher
                      ? 'bg-[#ff6900] text-white shadow-xs'
                      : 'bg-orange-50 dark:bg-orange-950/50 text-[#ff6900]'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {t('VOUCHER.LABEL', 'Voucher')}
                    </h4>
                    {selectedVoucher && (
                      <span className="text-[10px] font-black text-[#ff6900] bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded-md border border-orange-200/50">
                        {selectedVoucher.code}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#ff6900] font-medium">
                    {selectedVoucher
                      ? t('VOUCHER.DISCOUNT_APPLIED', {
                          amount: formatVND(selectedVoucher.discountAmount),
                          defaultValue: `Đã giảm -${formatVND(selectedVoucher.discountAmount)}`,
                        })
                      : t('VOUCHER.CHOOSE_OR_ENTER', 'Nhập hoặc chọn voucher của bạn')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#ff6900] transition-colors">
                <span className="text-xs font-semibold">
                  {selectedVoucher ? t('VOUCHER.CHANGE_CODE', 'Đổi mã') : t('VOUCHER.SELECT', 'Chọn')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Special Deal / Promotion Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/30 dark:shadow-black/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {t('CART.SPECIAL_OFFER', 'Ưu đãi đặc biệt')}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-[#ff6900] cursor-pointer hover:underline">
                {t('CART.SEE_MORE', 'Xem thêm')}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-gray-900 dark:text-white">{formatVND(subTotal)}</span>
              <span className="text-xs text-gray-400 line-through">/ 399.000 đ</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              {t(
                'CART.SPECIAL_OFFER_DESC',
                'Sản phẩm có giá đặc biệt áp dụng cho đơn tạm tính từ 299,000đ trở lên',
              )}
            </p>
            <div className="mt-3">
              <Link
                href="/"
                className="text-xs font-bold text-[#ff6900] hover:underline inline-flex items-center gap-1"
              >
                <span>{t('CART.ADD_MORE_ITEMS', 'Thêm món ngay')}</span>
                <span>›</span>
              </Link>
            </div>
          </div>

          {/* 3. Cutlery Option */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/30 dark:shadow-black/30 transition-colors flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                {t('CART.PLASTIC_CUTLERY', 'Muỗng nĩa nhựa')}
              </h4>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                {t('CART.PROTECT_ENVIRONMENT', 'Chung tay bảo vệ môi trường')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNeedCutlery((prev) => !prev)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                needCutlery
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {needCutlery ? t('CART.TAKE_CUTLERY', 'Có lấy') : t('CART.NO_CUTLERY', 'Không lấy')}
            </button>
          </div>

          {/* 4. Price Calculation Box */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/30 dark:shadow-black/30 transition-colors space-y-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 font-medium">
              <span>{t('CART.SUBTOTAL', 'Tạm tính')}:</span>
              <span className="text-gray-900 dark:text-white font-bold">{formatVND(subTotal)}</span>
            </div>

            {selectedVoucher && (
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1">
                  <span>
                    {t('CART.VOUCHER_DISCOUNT', {
                      code: selectedVoucher.code,
                      defaultValue: `Mã giảm giá (${selectedVoucher.code})`,
                    })}
                  </span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">-{formatVND(voucherDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1">
                <span>{t('CART.MEMBER_DISCOUNT', 'Giảm giá thành viên')}</span>
                <Info className="w-3 h-3 text-gray-400" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 đ</span>
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1">
                <span>{t('CART.DELIVERY_FEE', 'Phí giao hàng')}</span>
                <Info className="w-3 h-3 text-gray-400" />
              </span>
              <span className="text-gray-900 dark:text-white font-bold">
                {items.length > 0 ? formatVND(deliveryFee) : '0 đ'}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-baseline">
              <span className="text-sm font-black text-gray-900 dark:text-white">{t('CART.TOTAL', 'Tổng cộng')}:</span>
              <span className="text-xl font-black text-[#ff6900]">
                {items.length > 0 ? formatVND(finalTotal) : '0 đ'}
              </span>
            </div>

            {items.length > 0 && (
              <p className="text-[11px] text-right text-gray-400 dark:text-zinc-500">
                {t('CART.REWARD_POINTS_EARN', {
                  points: rewardPoints,
                  defaultValue: `Nhận ${rewardPoints} điểm Kei rewards`,
                })}
              </p>
            )}

            {/* Proceed to Step 2 Button */}
            <button
              type="button"
              disabled={items.length === 0}
              onClick={onProceedToCheckout}
              className="w-full mt-4 h-13 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#cc5200] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center cursor-pointer"
            >
              {t('CART.CHECKOUT_BUTTON', 'Thanh Toán')}
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail / Customization Modal for Editing Cart Item */}
      <ProductDetailModal
        product={editingItem?.product ?? null}
        cartItem={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
      />

      {/* Voucher Selection Modal */}
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        subTotal={subTotal}
        appliedCode={selectedVoucher?.code}
        onSelectVoucher={(voucher) => setSelectedVoucher(voucher)}
      />
    </>
  );
};
