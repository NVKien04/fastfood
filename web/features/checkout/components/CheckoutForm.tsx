'use client';

import { FC, BaseSyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckoutFormValues } from '../types';
import { PaymentMethodEnum } from '@/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Phone, MapPin, FileText, CreditCard, Truck, Loader2 } from 'lucide-react';
import { formatVND } from '@/utils';

type CheckoutFormProps = {
  form: UseFormReturn<CheckoutFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  isCartEmpty: boolean;
  total: number;
};

export const CheckoutForm: FC<CheckoutFormProps> = ({
  form,
  onSubmit,
  isLoading,
  isCartEmpty,
  total,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentPaymentMethod = watch('paymentMethod');

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* 1. Recipient Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
          <User className="w-5 h-5 text-red-600" />
          <span>Thông tin người nhận</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Họ và tên <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                {...register('guestName')}
                placeholder="Nhập họ và tên người nhận"
                className={`rounded-2xl h-12 bg-gray-50/50 ${
                  errors.guestName ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-[11px] font-medium text-red-500">{errors.guestName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Input
                type="tel"
                {...register('guestPhone')}
                placeholder="Nhập số điện thoại nhận hàng"
                className={`rounded-2xl h-12 bg-gray-50/50 ${
                  errors.guestPhone ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.guestPhone && (
              <p className="text-[11px] font-medium text-red-500">{errors.guestPhone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">
            Địa chỉ giao hàng chi tiết <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              {...register('guestAddress')}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              className={`rounded-2xl h-12 bg-gray-50/50 ${
                errors.guestAddress ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.guestAddress && (
            <p className="text-[11px] font-medium text-red-500">{errors.guestAddress.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">Ghi chú cho shipper</label>
          <Input
            type="text"
            {...register('notes')}
            placeholder="Ví dụ: Giao trước cửa, gọi điện khi tới nơi..."
            className="rounded-2xl h-12 bg-gray-50/50 border-gray-200"
          />
        </div>
      </div>

      {/* 2. Payment Method Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
          <CreditCard className="w-5 h-5 text-red-600" />
          <span>Phương thức thanh toán</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* COD */}
          <div
            onClick={() => setValue('paymentMethod', PaymentMethodEnum.COD)}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              currentPaymentMethod === PaymentMethodEnum.COD
                ? 'border-red-600 bg-red-50/40 shadow-xs'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  currentPaymentMethod === PaymentMethodEnum.COD
                    ? 'border-red-600'
                    : 'border-gray-300'
                }`}
              >
                {currentPaymentMethod === PaymentMethodEnum.COD && (
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                <span className="text-[10px] text-gray-400">Tiền mặt hoặc chuyển khoản</span>
              </div>
            </div>
            <Truck className="w-4 h-4 text-gray-400" />
          </div>

          {/* VNPAY */}
          <div
            onClick={() => setValue('paymentMethod', PaymentMethodEnum.VNPAY)}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              currentPaymentMethod === PaymentMethodEnum.VNPAY
                ? 'border-red-600 bg-red-50/40 shadow-xs'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  currentPaymentMethod === PaymentMethodEnum.VNPAY
                    ? 'border-red-600'
                    : 'border-gray-300'
                }`}
              >
                {currentPaymentMethod === PaymentMethodEnum.VNPAY && (
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">Cổng VNPay</span>
                <span className="text-[10px] text-gray-400">Thẻ ATM / QR Pay / Visa</span>
              </div>
            </div>
            <CreditCard className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 3. Submit Order Button */}
      <Button
        type="submit"
        disabled={isLoading || isCartEmpty}
        className="w-full h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-base rounded-2xl shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang xử lý đơn hàng...</span>
          </>
        ) : (
          <span>Đặt hàng ngay • {formatVND(total)}</span>
        )}
      </Button>
    </form>
  );
};
