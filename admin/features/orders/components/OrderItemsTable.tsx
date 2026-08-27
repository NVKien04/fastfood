'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { UtensilsCrossed, Sparkles } from 'lucide-react';
import { OrderItemResponseDto } from '../types';
import { formatCurrency } from '@/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface OrderItemsTableProps {
  items?: OrderItemResponseDto[];
}

export const OrderItemsTable = ({ items = [] }: OrderItemsTableProps) => {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed">
        <UtensilsCrossed className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">{t('COMMON.NO_DATA')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-14">#</TableHead>
            <TableHead>{t('ORDERS.ITEM_NAME')}</TableHead>
            <TableHead className="text-center">{t('ORDERS.QUANTITY')}</TableHead>
            <TableHead className="text-right">{t('ORDERS.PRICE')}</TableHead>
            <TableHead className="text-right">{t('ORDERS.AMOUNT')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const productName = item.productName || item.product?.name || 'Sản phẩm';
            const productImg = item.product?.img;
            const variantName = item.variantName || item.productVariant?.name;
            const unitPrice = item.price ?? 0;
            const totalPrice = unitPrice * item.quantity;
            const hasIngredients = item.ingredients && item.ingredients.length > 0;

            return (
              <TableRow key={item.id || index} className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground text-xs font-mono">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
                      {productImg ? (
                        <Image
                          src={productImg}
                          alt={productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm leading-tight text-foreground">
                        {productName}
                      </p>
                      {variantName && (
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-normal px-2 py-0 h-4.5 bg-muted text-muted-foreground"
                        >
                          {variantName}
                        </Badge>
                      )}
                      {hasIngredients && (
                        <div className="mt-1.5 space-y-0.5">
                          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            {t('ORDERS.TOPPINGS')}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients?.map((ing, i) => (
                              <span
                                key={ing.id || i}
                                className="inline-flex items-center text-[11px] rounded bg-muted/60 px-1.5 py-0.5 text-muted-foreground border"
                              >
                                +{ing.ingredientName} (x{ing.quantity})
                                {ing.ingredientPrice ? ` - ${formatCurrency(ing.ingredientPrice * ing.quantity)}` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-md bg-muted/60 text-xs font-semibold">
                    x{item.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatCurrency(unitPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm text-foreground">
                  {formatCurrency(totalPrice)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
