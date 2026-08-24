'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { PRODUCT_LIST } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductListModule = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [PRODUCT_LIST, { page, search }],
    queryFn: () => ApiMain.instance.product.getProducts({ page, limit: 10, search: search || undefined }),
  });

  const products = data?.kind === 'OK' ? data.data : [];
  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('PRODUCTS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination?.totalItems ?? 0} sản phẩm</p>
        </div>
        <Button onClick={() => router.push('/products/create')}>
          <Plus className="mr-2 h-4 w-4" /> {t('PRODUCTS.CREATE')}
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('COMMON.SEARCH') + '...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('PRODUCTS.IMAGE')}</TableHead>
                <TableHead>{t('PRODUCTS.NAME')}</TableHead>
                <TableHead>{t('PRODUCTS.CATEGORY')}</TableHead>
                <TableHead className="text-right">{t('PRODUCTS.PRICE')}</TableHead>
                <TableHead className="text-center">{t('COMMON.STATUS')}</TableHead>
                <TableHead className="text-center">{t('PRODUCTS.FEATURED')}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    {t('COMMON.NO_DATA')}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                        {product.img && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">ID: {product.categoryId}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.basePrice)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? t('COMMON.ACTIVE') : t('COMMON.INACTIVE')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.isFeatured ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">⭐</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" /> {t('COMMON.EDIT')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> {t('COMMON.DELETE')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {t('COMMON.PAGE')} {pagination.currentPage} {t('COMMON.OF')} {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ←
                </Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                  →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const ProductCreateModule = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('PRODUCTS.CREATE')}</h1>
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Form tạo sản phẩm sẽ được triển khai chi tiết ở bước tiếp theo.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProductEditModule = ({ params }: { params: Promise<{ id: string }> }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _resolvedParams = params;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('PRODUCTS.EDIT')}</h1>
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Form chỉnh sửa sản phẩm sẽ được triển khai chi tiết ở bước tiếp theo.</p>
        </CardContent>
      </Card>
    </div>
  );
};
