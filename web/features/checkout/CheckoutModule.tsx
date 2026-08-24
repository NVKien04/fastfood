'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderSummary } from './components/OrderSummary';
import { OrderSuccess } from './components/OrderSuccess';
import { CartReviewSection } from './components/CartReviewSection';

export const CheckoutModule = () => {
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
    <div className="w-full transition-colors">
      {/* Sticky Checkout Sub-Header Bar */}
      <div className="w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md sticky top-27.5 z-30 transition-colors">
        <div className="max-w-300 w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 relative flex items-center justify-center">
          {/* 1. Left Side: Back Arrow Only */}
          <div className="absolute left-4 sm:left-6 lg:left-8 flex items-center">
            {step === 1 ? (
              <Link
                href="/"
                className="p-2 -ml-2 text-gray-800 dark:text-zinc-200 hover:text-[#ff6900] dark:hover:text-[#ff6900] transition-colors cursor-pointer flex items-center justify-center"
                title="Quay lại thực đơn"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="p-2 -ml-2 text-gray-800 dark:text-zinc-200 hover:text-[#ff6900] dark:hover:text-[#ff6900] transition-colors cursor-pointer flex items-center justify-center"
                title="Quay lại giỏ hàng"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* 2. Center: Large Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight text-center">
            {step === 1 ? 'Giỏ hàng của tôi' : 'Thông tin giao hàng & Thanh toán'}
          </h1>
        </div>
      </div>

      {/* Main Content Area (Khoảng cách trên bằng 0) */}
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 transition-colors">
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
    </div>
  );
};
