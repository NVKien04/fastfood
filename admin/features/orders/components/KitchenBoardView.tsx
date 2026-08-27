'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Ban,
  Eye,
  Check,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';
import { OrderResponseDto } from '../types';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import {
  groupOrdersForKitchen,
  getTimeElapsedText,
  getCustomerDisplayName,
  getCustomerPhone,
  getDeliveryAddressText,
  formatOrderDateTime,
} from '../utils/order.utils';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KitchenBoardViewProps {
  orders: OrderResponseDto[];
  onUpdateStatus: (order: OrderResponseDto, nextStatus: OrderStatus) => void;
  onCancelOrder: (order: OrderResponseDto) => void;
}

export const KitchenBoardView = ({
  orders,
  onUpdateStatus,
  onCancelOrder,
}: KitchenBoardViewProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const grouped = useMemo(() => groupOrdersForKitchen(orders), [orders]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 items-start">
      {/* CỘT 1: CHỜ DUYỆT (PENDING) */}
      <div className="flex flex-col gap-3 rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-300">
              {t('ORDERS.KITCHEN_PENDING_COL')}
            </h3>
          </div>
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
            {grouped.pending.length}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {grouped.pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <ShoppingBag className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-xs">Không có đơn chờ duyệt</p>
            </div>
          ) : (
            grouped.pending.map((order) => (
              <Card
                key={order.id}
                className="border-amber-500/30 hover:border-amber-500 transition-all bg-card shadow-xs hover:shadow-md cursor-pointer group"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-foreground">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" />
                      {getTimeElapsedText(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground truncate max-w-[130px]">
                      {getCustomerDisplayName(order)}
                    </span>
                    <span>{getCustomerPhone(order)}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-3.5 pt-0 space-y-3">
                  {/* Items summary */}
                  <div className="rounded-lg bg-muted/40 p-2 text-xs space-y-1">
                    {order.orderItems?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-muted-foreground">
                        <span className="truncate pr-2">
                          <strong className="text-foreground">x{item.quantity}</strong>{' '}
                          {item.productName || item.product?.name}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatCurrency((item.price ?? 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {(order.orderItems?.length || 0) > 3 && (
                      <p className="text-[11px] text-muted-foreground italic text-center pt-1">
                        +{(order.orderItems?.length || 0) - 3} món khác...
                      </p>
                    )}
                  </div>

                  {order.notes && (
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-md">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.notes}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t text-xs">
                    <span className="text-muted-foreground">{t('ORDERS.TOTAL')}:</span>
                    <span className="font-bold text-sm text-primary">
                      {formatCurrency(order.total || 0)}
                    </span>
                  </div>

                  {/* Actions for Pending */}
                  <div
                    className="grid grid-cols-3 gap-1.5 pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 shadow-xs"
                      onClick={() => onUpdateStatus(order, OrderStatus.CONFIRMED)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {t('ORDERS.QUICK_CONFIRM')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-8"
                      onClick={() => onCancelOrder(order)}
                    >
                      <Ban className="h-3.5 w-3.5 mr-1" />
                      {t('COMMON.CANCEL')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* CỘT 2: BẾP ĐANG LÀM MÓN (CONFIRMED & PREPARING) */}
      <div className="flex flex-col gap-3 rounded-2xl bg-purple-500/5 p-4 border border-purple-500/20 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400">
              <ChefHat className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-purple-700 dark:text-purple-300">
              {t('ORDERS.KITCHEN_PREPARING_COL')}
            </h3>
          </div>
          <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30">
            {grouped.preparing.length}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {grouped.preparing.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <ChefHat className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-xs">Bếp đang trống đơn</p>
            </div>
          ) : (
            grouped.preparing.map((order) => {
              const isCooking = order.status === OrderStatus.PREPARING;

              return (
                <Card
                  key={order.id}
                  className={cn(
                    'border-purple-500/30 hover:border-purple-500 transition-all bg-card shadow-xs hover:shadow-md cursor-pointer',
                    isCooking && 'ring-1 ring-purple-500/50 bg-purple-500/5',
                  )}
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <CardHeader className="p-3.5 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-foreground">
                        #{order.orderNumber}
                      </span>
                      <Badge
                        variant={isCooking ? 'default' : 'secondary'}
                        className={cn(
                          'text-[10px] uppercase font-semibold',
                          isCooking
                            ? 'bg-purple-600 text-white'
                            : 'bg-blue-500/15 text-blue-600 border-blue-500/30',
                        )}
                      >
                        {isCooking ? 'Đang làm' : 'Đã nhận đơn'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getCustomerDisplayName(order)}
                    </p>
                  </CardHeader>

                  <CardContent className="p-3.5 pt-0 space-y-3">
                    {/* Kitchen Items breakdown */}
                    <div className="space-y-2 pt-1 border-t">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border bg-background/80 p-2 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-foreground text-sm">
                              x{item.quantity} {item.productName || item.product?.name}
                            </span>
                            {item.variantName && (
                              <Badge variant="outline" className="text-[10px] py-0 h-4">
                                {item.variantName}
                              </Badge>
                            )}
                          </div>

                          {item.ingredients && item.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {item.ingredients.map((ing, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] px-1.5 py-0.5 font-medium"
                                >
                                  <Sparkles className="h-2.5 w-2.5" />
                                  +{ing.ingredientName} (x{ing.quantity})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-md font-medium">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{order.notes}</span>
                      </div>
                    )}

                    {/* Actions for Kitchen */}
                    <div
                      className="pt-2 border-t flex flex-col gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!isCooking ? (
                        <Button
                          size="sm"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 shadow-xs font-semibold"
                          onClick={() => onUpdateStatus(order, OrderStatus.PREPARING)}
                        >
                          <ChefHat className="h-3.5 w-3.5 mr-1.5" />
                          {t('ORDERS.QUICK_PREPARE')}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 shadow-xs font-semibold"
                          onClick={() => onUpdateStatus(order, OrderStatus.READY_FOR_SHIPMENT)}
                        >
                          <Truck className="h-3.5 w-3.5 mr-1.5" />
                          {t('ORDERS.QUICK_READY')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* CỘT 3: ĐANG GIAO HÀNG (READY_FOR_SHIPMENT) */}
      <div className="flex flex-col gap-3 rounded-2xl bg-indigo-500/5 p-4 border border-indigo-500/20 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
              {t('ORDERS.KITCHEN_SHIPPING_COL')}
            </h3>
          </div>
          <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
            {grouped.shipping.length}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {grouped.shipping.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Truck className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-xs">Không có đơn đang giao</p>
            </div>
          ) : (
            grouped.shipping.map((order) => (
              <Card
                key={order.id}
                className="border-indigo-500/30 hover:border-indigo-500 transition-all bg-card shadow-xs hover:shadow-md cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-foreground">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {formatCurrency(order.total || 0)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {getCustomerDisplayName(order)}
                  </p>
                </CardHeader>

                <CardContent className="p-3.5 pt-0 space-y-3">
                  <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg">
                    <div className="flex items-start gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                      <span className="font-medium text-foreground">
                        {getCustomerPhone(order)}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                      <span className="line-clamp-2 leading-relaxed text-[11px]">
                        {getDeliveryAddressText(order)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="pt-2 border-t"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 shadow-xs font-semibold"
                      onClick={() => onUpdateStatus(order, OrderStatus.DELIVERED)}
                    >
                      <PackageCheck className="h-3.5 w-3.5 mr-1.5" />
                      {t('ORDERS.QUICK_DELIVER')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* CỘT 4: ĐÃ HOÀN THÀNH & ĐÃ HỦY (DELIVERED & CANCELLED) */}
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/20 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
              {t('ORDERS.KITCHEN_COMPLETED_COL')}
            </h3>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
            {grouped.completed.length}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {grouped.completed.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 opacity-30 mb-2" />
              <p className="text-xs">Chưa có đơn hoàn tất gần đây</p>
            </div>
          ) : (
            grouped.completed.map((order) => {
              const isDelivered = order.status === OrderStatus.DELIVERED;

              return (
                <Card
                  key={order.id}
                  className="border border-border/60 hover:border-primary/50 transition-all bg-card/80 shadow-2xs cursor-pointer opacity-85 hover:opacity-100"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-xs text-foreground">
                        #{order.orderNumber}
                      </span>
                      <Badge
                        variant={isDelivered ? 'default' : 'destructive'}
                        className="text-[10px] py-0 h-4.5"
                      >
                        {isDelivered ? 'Thành công' : 'Đã hủy'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 pt-0 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground mt-1">
                      <span>{getCustomerDisplayName(order)}</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(order.total || 0)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {formatOrderDateTime(order.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
