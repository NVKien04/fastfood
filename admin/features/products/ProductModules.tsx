'use client';

import { use, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pizza,
} from 'lucide-react';
import { toast } from 'sonner';

import { ApiMain } from '@/services/apis/main/api.main';
import { PRODUCT_LIST, CATEGORY_LIST } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductForm, ProductFormData } from './components/ProductForm';

export const ProductListModule = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: [PRODUCT_LIST, { page, search }],
    queryFn: () =>
      ApiMain.instance.product.getProducts({
        page,
        limit: 50,
        search: search || undefined,
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const products = useMemo(() => {
    return data?.kind === 'OK' && Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  const categories = useMemo(() => {
    return categoriesData?.kind === 'OK' && Array.isArray(categoriesData.data)
      ? categoriesData.data
      : [];
  }, [categoriesData]);

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ApiMain.instance.product.delete(id),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Xóa sản phẩm thành công');
        queryClient.invalidateQueries({ queryKey: [PRODUCT_LIST] });
      } else {
        toast.error(res.error || 'Có lỗi xảy ra');
      }
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === 'ALL' || String(p.categoryId) === selectedCategory;
      return matchCat;
    });
  }, [products, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('PRODUCTS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý thực đơn món ăn, danh mục, biến thể kích cỡ và giá niêm yết
          </p>
        </div>
        <Button onClick={() => router.push('/products/create')} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> {t('PRODUCTS.CREATE')}
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm món theo tên..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <Button
                type="button"
                variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('ALL')}
                className="text-xs h-8 rounded-lg cursor-pointer"
              >
                Tất cả ({products.length})
              </Button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <Button
                    key={cat.id}
                    type="button"
                    variant={selectedCategory === String(cat.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className="text-xs h-8 rounded-lg cursor-pointer shrink-0"
                  >
                    {cat.name} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Hình ảnh</TableHead>
                <TableHead>Tên món ăn</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Giá gốc</TableHead>
                <TableHead className="text-center">Số biến thể</TableHead>
                <TableHead className="text-center">Nổi bật</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="w-16 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-11 w-11 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const categoryName =
                    categoryMap.get(product.categoryId) || `ID #${product.categoryId}`;
                  const variantCount = product.variants?.length || 0;

                  return (
                    <TableRow
                      key={product.id}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      {/* Image Thumbnail */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted border border-border/80 flex items-center justify-center shrink-0">
                          {product.img ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.img}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Pizza className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-orange-50/50 text-[#ff6900] border-orange-200/60 dark:bg-orange-950/20 dark:border-orange-900/40 font-medium"
                        >
                          {categoryName}
                        </Badge>
                      </TableCell>

                      {/* Base Price */}
                      <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(product.basePrice)}
                      </TableCell>

                      {/* Variants count */}
                      <TableCell className="text-center font-medium text-xs text-muted-foreground">
                        {variantCount > 0 ? `${variantCount} size/đế` : 'Mặc định'}
                      </TableCell>

                      {/* Featured */}
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        {product.isFeatured ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/40 text-[11px] font-bold">
                            ⭐ Nổi bật
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                          className={
                            product.isActive
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30'
                              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }
                        >
                          {product.isActive ? 'Đang bán' : 'Tạm ẩn'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/products/${product.id}`)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => {
                                if (
                                  confirm(`Bạn có chắc chắn muốn xóa món "${product.name}"?`)
                                ) {
                                  deleteMutation.mutate(product.id);
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa món
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Trang {pagination.currentPage} / {pagination.totalPages} ({pagination.totalItems} món)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="cursor-pointer text-xs"
                >
                  ← Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="cursor-pointer text-xs"
                >
                  Sau →
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
  return <ProductForm />;
};

export const ProductEditModule = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { data, isLoading } = useQuery({
    queryKey: [PRODUCT_LIST, productId],
    queryFn: () => ApiMain.instance.product.getById(productId),
  });

  const product = data?.kind === 'OK' ? data.data : undefined;

  const initialData: ProductFormData | undefined = useMemo(() => {
    if (!product) return undefined;
    return {
      name: product.name,
      description: product.description || '',
      basePrice: product.basePrice,
      categoryId: product.categoryId,
      img: product.img || '',
      sortOrder: product.sortOrder ?? 0,
      isFeatured: product.isFeatured ?? 0,
      isActive: product.isActive ?? 1,
      variants: (product.variants || []).map((v) => ({
        name: v.name,
        size: v.size,
        type: v.type,
        modifiedPrice: v.modifiedPrice || 0,
        sortOrder: v.sortOrder || 0,
        isActive: v.isActive ?? 1,
      })),
    };
  }, [product]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center border rounded-2xl">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm này</p>
      </div>
    );
  }

  return <ProductForm isEdit productId={productId} initialData={initialData} />;
};
