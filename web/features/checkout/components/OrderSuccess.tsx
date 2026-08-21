'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Truck, ShoppingBag } from 'lucide-react';
import { formatVND } from '@/utils';
import { OrderResponseDto } from '../types';

type OrderSuccessProps = {
  order: OrderResponseDto;
};

export const OrderSuccess: FC<OrderSuccessProps> = ({ order }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl dark:shadow-black/40 flex flex-col items-center transition-colors">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 mb-3">
          Đặt hàng thành công! 🎉
        </Badge>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Cảm ơn bạn đã đặt hàng</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
          Mã đơn hàng của bạn là:{' '}
          <strong className="text-[#ff6900] font-mono text-base">#{order.orderNumber}</strong>
        </p>

        {/* Order Details Preview */}
        <div className="w-full bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 mt-8 border border-gray-100 dark:border-zinc-800 text-left space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Trạng thái đơn</span>
            <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-xs font-bold capitalize">
              {order.status || 'Đang chuẩn bị'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 dark:text-zinc-500 block mb-1">Người nhận:</span>
              <strong className="text-gray-800 dark:text-zinc-100 text-sm">{order.guestName || 'Khách hàng'}</strong>
              <div className="text-gray-600 dark:text-zinc-400 mt-0.5">{order.guestPhone}</div>
            </div>

            <div>
              <span className="text-gray-400 dark:text-zinc-500 block mb-1">Địa chỉ giao hàng:</span>
              <div className="text-gray-800 dark:text-zinc-200 font-medium">{order.guestAddress}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400">
              <Truck className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <span>Giao hàng tiêu chuẩn (30 phút)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-zinc-500">Tổng tiền:</span>
              <strong className="text-lg font-black text-[#ff6900]">
                {formatVND(Number(order.total || 0))}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
          <Link href="/">
            <Button className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#ff6900] hover:bg-[#e05d00] text-white font-black shadow-lg shadow-orange-500/20 cursor-pointer">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tiếp tục mua hàng
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
