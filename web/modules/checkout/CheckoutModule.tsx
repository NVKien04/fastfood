'use client';

import * as React from 'react';
import Link from 'next/link';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { useCreateOrder } from '@/services/react-query/mutations/order';
import { useStore } from '@/stores';
import { formatVND } from '../product/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  User,
  Phone,
  MapPin,
  FileText,
  Loader2,
  Utensils,
  AlertCircle,
} from 'lucide-react';

export const CheckoutModule: React.FC = () => {
  const { user } = useStore();
  const items = useStore((s) => s.items);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const clearCart = useStore((s) => s.clearCart);
  const subTotal = useStore((s) => s.getTotalPrice());

  const deliveryFee = 15000;
  const total = subTotal + deliveryFee;

  // Form State
  const [guestName, setGuestName] = React.useState<string>('');
  const [guestPhone, setGuestPhone] = React.useState<string>('');
  const [guestAddress, setGuestAddress] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [paymentMethod] = React.useState<string>('COD');

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = React.useState<OrderResponseDto | null>(null);

  const createOrderMutation = useCreateOrder();
  const loading = createOrderMutation.isPending;

  // Autofill user info if logged in
  React.useEffect(() => {
    if (user) {
      if (user.fullName) setGuestName(user.fullName);
    }
  }, [user]);

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!guestName.trim() || !guestPhone.trim() || !guestAddress.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    setErrorMessage(null);

    const payload = {
      items: items.map((item) => ({
        productId: item.product.id,
        productVariantId: item.variant?.id,
        ingredients: item.selectedIngredients.map((ing) => ({
          ingredientId: ing.id,
          quantity: 1,
        })),
        quantity: item.quantity,
      })),
      guestName,
      guestPhone,
      guestAddress,
      notes,
      paymentMethod,
    };

    createOrderMutation.mutate(payload, {
      onSuccess: (data) => {
        if (data) {
          setCreatedOrder(data);
          clearCart();
        } else {
          setErrorMessage('Đặt hàng thất bại. Vui lòng thử lại sau.');
        }
      },
      onError: (err) => {
        setErrorMessage(err.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.');
      },
    });
  };

  // Order Success View
  if (createdOrder) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-black uppercase tracking-wider px-3 py-1 mb-3">
            Đặt hàng thành công! 🎉
          </Badge>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cảm ơn bạn đã đặt hàng</h1>
          <p className="text-sm text-gray-500 mt-2">
            Mã đơn hàng của bạn là: <strong className="text-red-600 font-mono text-base">#{createdOrder.orderNumber}</strong>
          </p>

          <div className="w-full bg-gray-50 rounded-2xl p-6 mt-8 border border-gray-100 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Khách hàng:</span>
              <span className="font-bold text-gray-900">{createdOrder.guestName || user?.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số điện thoại:</span>
              <span className="font-bold text-gray-900">{createdOrder.guestPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Địa chỉ giao hàng:</span>
              <span className="font-bold text-gray-900 text-right max-w-[280px]">{createdOrder.guestAddress}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="text-gray-500">Tổng thanh toán (COD):</span>
              <span className="font-black text-red-600 text-lg">{formatVND(createdOrder.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Link href="/product">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 py-3 text-xs shadow-lg shadow-red-600/20">
                Tiếp tục mua hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart View
  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xl flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 mb-4">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Giỏ hàng của bạn đang trống</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Hãy khám phá các món ăn thơm ngon hấp dẫn và thêm vào giỏ hàng ngay nhé!
          </p>

          <Link href="/product" className="mt-6">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 py-3 text-xs shadow-lg shadow-red-600/20 flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span>Xem thực đơn món ăn</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Navigation Back Link */}
      <Link
        href="/product"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Thực Đơn</span>
      </Link>

      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Xác Nhận Đơn Hàng & Thanh Toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <span>Món Ăn Đã Chọn ({items.length})</span>
              </h2>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            </div>

            <div className="divide-y divide-gray-100 space-y-4 divide-y-0">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 flex items-center justify-center shrink-0">
                      <Utensils className="w-7 h-7 text-red-500" />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.product.name}</h3>

                      {/* Selected Variant */}
                      {item.variant && (
                        <span className="inline-block text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md mt-1">
                          {item.variant.name} ({item.variant.size} - {item.variant.type})
                        </span>
                      )}

                      {/* Selected Toppings/Ingredients */}
                      {item.selectedIngredients.length > 0 && (
                        <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                          + Topping:{' '}
                          {item.selectedIngredients.map((ing) => `${ing.name} (+${formatVND(ing.price || 0)})`).join(', ')}
                        </p>
                      )}

                      <p className="text-xs font-black text-gray-900 mt-2">{formatVND(item.unitPrice)} / phần</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Stepper Quantity Buttons */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 text-gray-600 hover:bg-white rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="w-6 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 text-gray-600 hover:bg-white rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <span className="font-black text-sm text-red-600">{formatVND(item.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Information & Checkout Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-600" />
              <span>Thông Tin Giao Hàng</span>
            </h2>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Họ và Tên Người Nhận <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nhập họ và tên người nhận"
                  required
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Số Điện Thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Nhập số điện thoại nhận hàng"
                  required
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Customer Delivery Address */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Địa Chỉ Giao Hàng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                  required
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Ghi Chú Đơn Hàng (Không bắt buộc)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước 10 phút..."
                  rows={2}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Phương Thức Thanh Toán
              </label>
              <div className="p-3.5 rounded-xl border border-red-600 bg-red-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-[11px] text-gray-500">Trả tiền mặt trực tiếp cho Shipper</p>
                  </div>
                </div>
                <Badge className="bg-red-600 text-white font-extrabold text-[10px]">COD</Badge>
              </div>
            </div>

            {/* Order Price Summary */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính món ăn:</span>
                <span className="font-bold text-gray-900">{formatVND(subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng:</span>
                <span className="font-bold text-gray-900">{formatVND(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Tổng thanh toán:</span>
                <span className="text-red-600 text-xl font-black">{formatVND(total)}</span>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Place Order Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl text-sm shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý đơn hàng...</span>
                </>
              ) : (
                <span>Đặt Hàng Ngay ({formatVND(total)})</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
