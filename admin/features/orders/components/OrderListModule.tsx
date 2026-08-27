'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  Search,
  RefreshCw,
  Eye,
  MoreHorizontal,
  ArrowRight,
  Ban,
  ShoppingBag,
  LayoutGrid,
  Table as TableIcon,
  Printer,
  Check,
  ChefHat,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { useOrderList } from '../hooks/useOrderList';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { OrderFilterStatus, OrderResponseDto } from '../types';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import {
  getCustomerDisplayName,
  getCustomerPhone,
  getValidNextTransitions,
  canCancelOrder,
  formatOrderDateTime,
  getQuickActionButtonConfig,
} from '../utils/order.utils';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderPaymentBadge } from './OrderPaymentBadge';
import { OrderStatsCards } from './OrderStatsCards';
import { KitchenBoardView } from './KitchenBoardView';
import { UpdateStatusDialog } from './UpdateStatusDialog';
import { CancelOrderDialog } from './CancelOrderDialog';
import { PrintReceiptDialog } from './PrintReceiptDialog';
import { cn } from '@/lib/utils';

export const OrderListModule = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'table' | 'kitchen'>('table');

  const {
    orders,
    pagination,
    isLoading,
    isFetching,
    page,
    status,
    search,
    stats,
    handleStatusChange,
    handleSearchChange,
    handlePageChange,
    refetch,
  } = useOrderList();

  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  // Modals state
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<OrderResponseDto | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<OrderResponseDto | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<OrderResponseDto | null>(null);

  const handleOpenStatusModal = (order: OrderResponseDto, nextStatus: OrderStatus) => {
    setSelectedOrderForStatus(order);
    setTargetStatus(nextStatus);
  };

  const handleOpenCancelModal = (order: OrderResponseDto) => {
    setSelectedOrderForCancel(order);
  };

  const handleOpenPrintModal = (order: OrderResponseDto) => {
    setSelectedOrderForPrint(order);
  };

  const handleConfirmStatusChange = async (id: string, newStatus: OrderStatus) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
  };

  const handleConfirmCancel = async (id: string, reason?: string) => {
    await cancelOrderMutation.mutateAsync({ id, reason });
  };

  const renderQuickActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'check':
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case 'chef-hat':
        return <ChefHat className="h-3.5 w-3.5 mr-1" />;
      case 'truck':
        return <Truck className="h-3.5 w-3.5 mr-1" />;
      case 'package-check':
        return <PackageCheck className="h-3.5 w-3.5 mr-1" />;
      default:
        return <ArrowRight className="h-3.5 w-3.5 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Mode Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('ORDERS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Điều phối đơn hàng, duyệt đơn & màn hình vận hành bếp
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted p-1 rounded-lg border">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={cn(
                'h-7 px-3 text-xs gap-1.5',
                viewMode === 'table' ? 'shadow-2xs' : 'text-muted-foreground',
              )}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>{t('ORDERS.VIEW_TABLE')}</span>
            </Button>
            <Button
              variant={viewMode === 'kitchen' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kitchen')}
              className={cn(
                'h-7 px-3 text-xs gap-1.5',
                viewMode === 'kitchen' ? 'shadow-2xs' : 'text-muted-foreground',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{t('ORDERS.VIEW_KANBAN')}</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 h-9"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStatsCards
        stats={stats}
        activeStatus={status}
        onSelectStatus={handleStatusChange}
      />

      {/* Conditional View: Table View vs Kitchen Board View */}
      {viewMode === 'kitchen' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('ORDERS.SEARCH_PLACEHOLDER')}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Hiển thị {orders.length} đơn hàng trên bảng vận hành
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <KitchenBoardView
              orders={orders}
              onUpdateStatus={handleOpenStatusModal}
              onCancelOrder={handleOpenCancelModal}
            />
          )}
        </div>
      ) : (
        /* Main Table Card */
        <Card className="border-border/60 shadow-2xs">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('ORDERS.SEARCH_PLACEHOLDER')}
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Select<string>
                  value={status}
                  onValueChange={(val) => {
                    if (val) handleStatusChange(val as OrderFilterStatus);
                  }}
                >
                  <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder={t('ORDERS.STATUS')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('ORDERS.ALL')}</SelectItem>
                    {Object.values(OrderStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`ORDERS.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-32">{t('ORDERS.ORDER_NUMBER')}</TableHead>
                    <TableHead>{t('ORDERS.CUSTOMER')}</TableHead>
                    <TableHead>{t('ORDERS.ITEMS')}</TableHead>
                    <TableHead className="text-right">{t('ORDERS.TOTAL')}</TableHead>
                    <TableHead>{t('ORDERS.PAYMENT')}</TableHead>
                    <TableHead>{t('ORDERS.STATUS')}</TableHead>
                    <TableHead className="text-right">{t('COMMON.CREATED_AT')}</TableHead>
                    <TableHead className="text-right pr-4">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-8 w-8 mb-2 opacity-40" />
                          <p className="font-medium text-sm">{t('COMMON.NO_DATA')}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => {
                      const nextTransitions = getValidNextTransitions(order.status);
                      const isCancellable = canCancelOrder(order.status);
                      const itemsCount = order.orderItems?.length || 0;
                      const firstItem = order.orderItems?.[0];
                      const quickAction = getQuickActionButtonConfig(order.status);

                      return (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/40 transition-colors"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          {/* Order Number */}
                          <TableCell className="font-semibold font-mono text-sm text-foreground">
                            #{order.orderNumber}
                          </TableCell>

                          {/* Customer Info */}
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {getCustomerDisplayName(order)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {getCustomerPhone(order)}
                              </p>
                            </div>
                          </TableCell>

                          {/* Items Summary */}
                          <TableCell>
                            <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                              {itemsCount > 0 ? (
                                <span>
                                  <strong className="text-foreground">{itemsCount} món:</strong>{' '}
                                  {firstItem?.productName || firstItem?.product?.name}
                                  {itemsCount > 1 && ` (+${itemsCount - 1})`}
                                </span>
                              ) : (
                                '—'
                              )}
                            </div>
                          </TableCell>

                          {/* Total */}
                          <TableCell className="text-right font-bold text-sm text-foreground">
                            {formatCurrency(order.total || 0)}
                          </TableCell>

                          {/* Payment */}
                          <TableCell>
                            <OrderPaymentBadge
                              paymentMethod={order.paymentMethod}
                              paymentStatus={order.paymentStatus}
                            />
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>

                          {/* Date */}
                          <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                            {formatOrderDateTime(order.createdAt)}
                          </TableCell>

                          {/* Action Buttons & Menu */}
                          <TableCell
                            className="text-right pr-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1-Click Operational Quick Action Button */}
                              {quickAction && (
                                <Button
                                  size="sm"
                                  className={cn('h-8 px-2.5 text-xs', quickAction.className)}
                                  onClick={() =>
                                    handleOpenStatusModal(order, quickAction.nextStatus)
                                  }
                                >
                                  {renderQuickActionIcon(quickAction.iconName)}
                                  <span>{t(quickAction.label)}</span>
                                </Button>
                              )}

                              {/* Dropdown Menu for Extra Actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/orders/${order.id}`)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('ORDERS.VIEW_DETAIL')}
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleOpenPrintModal(order)}
                                    className="cursor-pointer"
                                  >
                                    <Printer className="mr-2 h-4 w-4" />
                                    {t('ORDERS.PRINT_RECEIPT')}
                                  </DropdownMenuItem>

                                  {nextTransitions.length > 0 && (
                                    <>
                                      <DropdownMenuSeparator />
                                      {nextTransitions.map((tItem) => (
                                        <DropdownMenuItem
                                          key={tItem.nextStatus}
                                          onClick={() =>
                                            handleOpenStatusModal(order, tItem.nextStatus)
                                          }
                                          className="cursor-pointer font-medium text-primary"
                                        >
                                          <ArrowRight className="mr-2 h-4 w-4" />
                                          {tItem.label}
                                        </DropdownMenuItem>
                                      ))}
                                    </>
                                  )}

                                  {isCancellable && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleOpenCancelModal(order)}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                      >
                                        <Ban className="mr-2 h-4 w-4" />
                                        {t('ORDERS.CANCEL_ORDER')}
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-xs text-muted-foreground">
                  {t('COMMON.PAGE')} <strong className="text-foreground">{pagination.currentPage}</strong>{' '}
                  {t('COMMON.OF')} <strong className="text-foreground">{pagination.totalPages}</strong> (
                  {pagination.totalItems} đơn hàng)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    →
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Update Confirmation Modal */}
      <UpdateStatusDialog
        isOpen={Boolean(selectedOrderForStatus && targetStatus)}
        onClose={() => {
          setSelectedOrderForStatus(null);
          setTargetStatus(null);
        }}
        order={selectedOrderForStatus}
        targetStatus={targetStatus}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />

      {/* Cancel Order Modal */}
      <CancelOrderDialog
        isOpen={Boolean(selectedOrderForCancel)}
        onClose={() => setSelectedOrderForCancel(null)}
        order={selectedOrderForCancel}
        onConfirm={handleConfirmCancel}
        isLoading={cancelOrderMutation.isPending}
      />

      {/* Print Slip Dialog */}
      <PrintReceiptDialog
        isOpen={Boolean(selectedOrderForPrint)}
        onClose={() => setSelectedOrderForPrint(null)}
        order={selectedOrderForPrint}
      />
    </div>
  );
};
