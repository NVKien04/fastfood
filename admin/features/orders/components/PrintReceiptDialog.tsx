'use client';

import { useTranslation } from 'react-i18next';
import { Printer, UtensilsCrossed } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderResponseDto } from '../types';
import { formatCurrency } from '@/utils';
import {
  getCustomerDisplayName,
  getCustomerPhone,
  getDeliveryAddressText,
  formatOrderDateTime,
  getPaymentMethodLabel,
} from '../utils/order.utils';

interface PrintReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponseDto | null;
}

export const PrintReceiptDialog = ({
  isOpen,
  onClose,
  order,
}: PrintReceiptDialogProps) => {
  const { t } = useTranslation();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            {t('ORDERS.PRINT_RECEIPT')}
          </DialogTitle>
        </DialogHeader>

        {/* Printable Kitchen & Customer Slip Area */}
        <div
          id="printable-slip"
          className="p-6 bg-white text-black font-mono text-xs rounded-xl border space-y-4 shadow-inner"
        >
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-neutral-300">
            <div className="flex items-center justify-center gap-1 font-bold text-base tracking-wider">
              <UtensilsCrossed className="h-4 w-4" />
              <span>FASTFOOD KITCHEN SLIP</span>
            </div>
            <p className="text-[11px] text-neutral-500">Phiếu Chế Biến & Giao Hàng</p>
            <p className="text-sm font-extrabold tracking-widest pt-1">
              ĐƠN #{order.orderNumber}
            </p>
            <p className="text-[10px] text-neutral-500">
              Giờ đặt: {formatOrderDateTime(order.createdAt)}
            </p>
          </div>

          {/* Customer info */}
          <div className="space-y-1 pb-3 border-b border-dashed border-neutral-300 text-[11px]">
            <p>
              <strong>Khách:</strong> {getCustomerDisplayName(order)}
            </p>
            <p>
              <strong>SĐT:</strong> {getCustomerPhone(order)}
            </p>
            <p className="leading-tight">
              <strong>Địa chỉ:</strong> {getDeliveryAddressText(order)}
            </p>
            {order.notes && (
              <div className="mt-1 p-1.5 bg-neutral-100 rounded border border-neutral-300 font-sans text-neutral-800 font-bold">
                ⚠️ Ghi chú: {order.notes}
              </div>
            )}
          </div>

          {/* Items list */}
          <div className="space-y-2.5 pb-3 border-b border-dashed border-neutral-300">
            <div className="flex justify-between font-bold border-b pb-1">
              <span>MÓN</span>
              <span>SL / GIÁ</span>
            </div>

            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start text-xs font-bold">
                  <span>
                    {idx + 1}. {item.productName || item.product?.name}
                    {item.variantName ? ` (${item.variantName})` : ''}
                  </span>
                  <span className="shrink-0 pl-2">
                    x{item.quantity} - {formatCurrency((item.price ?? 0) * item.quantity)}
                  </span>
                </div>
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="pl-3 text-[10px] text-neutral-600 space-y-0.5">
                    {item.ingredients.map((ing, i) => (
                      <p key={i}>
                        + {ing.ingredientName} (x{ing.quantity})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatCurrency(order.subTotal || 0)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Phí ship:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-sm border-t pt-1.5">
              <span>TỔNG CỘNG:</span>
              <span>{formatCurrency(order.total || 0)}</span>
            </div>
            <p className="text-[10px] text-neutral-500 pt-1 text-center">
              Thanh toán: {getPaymentMethodLabel(order.paymentMethod)} (
              {order.paymentStatus})
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {t('COMMON.CLOSE')}
          </Button>
          <Button onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            <span>In phiếu</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
