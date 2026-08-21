'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderSummary } from './components/OrderSummary';
import { OrderSuccess } from './components/OrderSuccess';
import { CartReviewSection } from './components/CartReviewSection';

export const CheckoutModule: FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const {
    form,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subTotal,
    deliveryFee,
    total,
    onSubmit,
    isLoading,
    errorMessage,
    createdOrder,
  } = useCheckout();

  if (createdOrder) {
    return <OrderSuccess order={createdOrder} />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 transition-colors">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          {step === 1 ? (
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-[#ff6900] dark:hover:text-[#ff6900] hover:border-orange-200 dark:hover:border-orange-900 transition-colors shadow-xs cursor-pointer"
              title="Quay lại thực đơn"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-[#ff6900] dark:hover:text-[#ff6900] hover:border-orange-200 dark:hover:border-orange-900 transition-colors shadow-xs cursor-pointer"
              title="Quay lại giỏ hàng"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {step === 1 ? 'Giỏ hàng của tôi' : 'Thông tin giao hàng & Thanh toán'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
              {step === 1
                ? 'Kiểm tra và tùy chỉnh các món ăn trước khi tiến hành thanh toán'
                : 'Vui lòng nhập địa chỉ nhận hàng và chọn phương thức thanh toán'}
            </p>
          </div>
        </div>

        {/* Step Indicator Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-zinc-800/80 px-4 py-2 rounded-full text-xs font-bold text-gray-600 dark:text-zinc-300">
          <span className={step === 1 ? 'text-[#ff6900]' : 'text-gray-400'}>1. Giỏ hàng</span>
          <span>→</span>
          <span className={step === 2 ? 'text-[#ff6900]' : 'text-gray-400'}>2. Giao hàng &amp; Thanh toán</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: My Cart Review (Danh sách món, Sửa món, Voucher,...) */}
      {/* ============================================================ */}
      {step === 1 && (
        <CartReviewSection
          items={items}
          subTotal={subTotal}
          deliveryFee={deliveryFee}
          total={total}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          clearCart={clearCart}
          onProceedToCheckout={() => setStep(2)}
        />
      )}

      {/* ============================================================ */}
      {/* STEP 2: Customer Information & Payment (Sau khi chốt order)   */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start animate-in fade-in duration-200">
          {/* Left Column: Order Summary with Back to Edit button */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Đơn hàng ({items.length} món)
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#ff6900] hover:underline cursor-pointer"
              >
                Thay đổi giỏ hàng
              </button>
            </div>
            <OrderSummary
              items={items}
              subTotal={subTotal}
              deliveryFee={deliveryFee}
              total={total}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              clearCart={clearCart}
            />
          </div>

          {/* Right Column: Customer Form & Payment Method */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <CheckoutForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
              isCartEmpty={items.length === 0}
              total={total}
            />
          </div>
        </div>
      )}
    </div>
  );
};
