'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderSummary } from './components/OrderSummary';
import { OrderSuccess } from './components/OrderSuccess';

export const CheckoutModule: FC = () => {
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header Breadcrumb / Back */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <Link
          href="/"
          className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Thanh toán đơn hàng
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Vui lòng kiểm tra lại món ăn và thông tin giao nhận
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Information & Payment Form */}
        <div className="lg:col-span-7">
          <CheckoutForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isCartEmpty={items.length === 0}
            total={total}
          />
        </div>

        {/* Right Column: Cart Summary */}
        <div className="lg:col-span-5">
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
      </div>
    </div>
  );
};
