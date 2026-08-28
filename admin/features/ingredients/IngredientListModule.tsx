'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Search,
  Utensils,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { ApiMain } from '@/services/apis/main/api.main';
import { INGREDIENT_LIST, CATEGORY_LIST } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Tên nguyên liệu không được để trống'),
  imageUrl: z.string().min(1, 'URL hình ảnh không được để trống'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, 'Đơn giá phải lớn hơn hoặc bằng 0'),
  categoryId: z.coerce.number().min(1, 'Vui lòng chọn danh mục'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isRequired: z.coerce.number().default(0),
  isActive: z.coerce.number().default(1),
});

type IngredientFormData = z.input<typeof ingredientSchema>;

export const IngredientListModule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: ingredientsData, isLoading } = useQuery({
    queryKey: [INGREDIENT_LIST],
    queryFn: () => ApiMain.instance.ingredient.getIngredients({ limit: 100 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const rawIngredients = useMemo(() => {
    return ingredientsData?.kind === 'OK' && Array.isArray(ingredientsData.data)
      ? ingredientsData.data
      : [];
  }, [ingredientsData]);

  const categories = useMemo(() => {
    return categoriesData?.kind === 'OK' && Array.isArray(categoriesData.data)
      ? categoriesData.data
      : [];
  }, [categoriesData]);

  // Tạo map tra cứu nhanh danh mục
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      description: '',
      price: 0,
      categoryId: 0,
      sortOrder: 0,
      isRequired: 0,
      isActive: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (formData: IngredientFormData) => ApiMain.instance.ingredient.create(formData),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Tạo nguyên liệu/topping thành công');
        queryClient.invalidateQueries({ queryKey: [INGREDIENT_LIST] });
        setDialogOpen(false);
        form.reset();
      } else {
        toast.error(res.error || 'Có lỗi xảy ra');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: IngredientFormData }) =>
      ApiMain.instance.ingredient.update(id, formData),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Cập nhật nguyên liệu/topping thành công');
        queryClient.invalidateQueries({ queryKey: [INGREDIENT_LIST] });
        setDialogOpen(false);
        setEditId(null);
        form.reset();
      } else {
        toast.error(res.error || 'Có lỗi xảy ra');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiMain.instance.ingredient.delete(id),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Xóa nguyên liệu/topping thành công');
        queryClient.invalidateQueries({ queryKey: [INGREDIENT_LIST] });
      } else {
        toast.error(res.error || 'Có lỗi xảy ra');
      }
    },
  });

  const handleOpenCreate = () => {
    setEditId(null);
    form.reset({
      name: '',
      imageUrl: '',
      description: '',
      price: 0,
      categoryId: categories.length > 0 ? categories[0].id : 0,
      sortOrder: 0,
      isRequired: 0,
      isActive: 1,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: (typeof rawIngredients)[0]) => {
    setEditId(item.id);
    form.reset({
      name: item.name,
      imageUrl: item.imageUrl || '',
      description: item.description || '',
      price: item.price || 0,
      categoryId: item.categoryId,
      sortOrder: item.sortOrder ?? 0,
      isRequired: item.isRequired ?? 0,
      isActive: item.isActive ?? 1,
    });
    setDialogOpen(true);
  };

  const onSubmit = (formData: IngredientFormData) => {
    if (editId) {
      updateMutation.mutate({ id: editId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Filter nguyên liệu theo category & search
  const filteredIngredients = useMemo(() => {
    return rawIngredients.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' || String(item.categoryId) === selectedCategory;
      const matchSearch =
        !searchTerm.trim() ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [rawIngredients, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('INGREDIENTS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý kho Topping, Phô mai, Nước sốt và Nguyên liệu gọi thêm cho món ăn
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Thêm nguyên liệu / Topping
        </Button>
      </div>

      {/* Main Table Card with Category Filter Bar */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm nguyên liệu, topping..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                Tất cả ({rawIngredients.length})
              </Button>
              {categories.map((cat) => {
                const count = rawIngredients.filter((i) => i.categoryId === cat.id).length;
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
                <TableHead>Tên nguyên liệu</TableHead>
                <TableHead>Danh mục liên kết</TableHead>
                <TableHead className="text-right">Đơn giá (+VNĐ)</TableHead>
                <TableHead className="text-center">Thứ tự</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="w-16 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredIngredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] flex items-center justify-center">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {searchTerm ? 'Không tìm thấy nguyên liệu phù hợp' : 'Kho nguyên liệu / Topping đang trống'}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Thêm các loại topping phô mai, thịt xông khói, sốt hoặc nguyên liệu thêm để khách hàng có thể tùy biến món ăn.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleOpenCreate}
                        className="mt-2 cursor-pointer"
                      >
                        <Plus className="mr-1.5 w-4 h-4" /> Thêm nguyên liệu ngay
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIngredients.map((item) => {
                  const categoryName = categoryMap.get(item.categoryId) || `Danh mục #${item.categoryId}`;
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                      {/* Image Thumbnail */}
                      <TableCell>
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border/80 flex items-center justify-center shrink-0">
                          {item.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Utensils className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>

                      {/* Name & Desc */}
                      <TableCell>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50/50 text-[#ff6900] border-orange-200/60 dark:bg-orange-950/20 dark:border-orange-900/40">
                          {categoryName}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right font-bold text-gray-900 dark:text-white">
                        {item.price > 0 ? `+${formatCurrency(item.price)}` : 'Miễn phí'}
                      </TableCell>

                      {/* Sort Order */}
                      <TableCell className="text-center font-medium">
                        {item.sortOrder ?? 0}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                          className={
                            item.isActive
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30'
                              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }
                        >
                          {item.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
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
                              onClick={() => handleOpenEdit(item)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => {
                                if (confirm(`Bạn có chắc chắn muốn xóa nguyên liệu "${item.name}"?`)) {
                                  deleteMutation.mutate(item.id);
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa
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
        </CardContent>
      </Card>

      {/* Dialog Tạo / Sửa Nguyên liệu */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editId ? 'Chỉnh sửa nguyên liệu / topping' : 'Thêm nguyên liệu / topping mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Quick Presets for fast creation */}
            {!editId && (
              <div className="space-y-1.5 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40">
                <p className="text-[11px] font-bold text-[#ff6900]">
                  💡 Gợi ý mẫu nhanh (Bấm để điền mẫu):
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    {
                      name: 'Phô mai Mozzarella',
                      price: 25000,
                      imageUrl:
                        'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=300&q=80',
                      description: 'Phô mai Mozzarella béo ngậy kéo sợi',
                    },
                    {
                      name: 'Xúc xích Pepperoni',
                      price: 30000,
                      imageUrl:
                        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80',
                      description: 'Xúc xích cay nướng thơm lừng',
                    },
                    {
                      name: 'Thịt xông khói',
                      price: 30000,
                      imageUrl:
                        'https://images.unsplash.com/photo-1606851094655-b2593a9af63f?w=300&q=80',
                      description: 'Thịt xông khói áp chảo giòn thơm',
                    },
                    {
                      name: 'Nấm tươi cao cấp',
                      price: 15000,
                      imageUrl:
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80',
                      description: 'Nấm tươi giòn ngọt tự nhiên',
                    },
                    {
                      name: 'Ớt chuông đỏ',
                      price: 10000,
                      imageUrl:
                        'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&q=80',
                      description: 'Ớt chuông tươi giòn ngọt thanh',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        form.setValue('name', preset.name);
                        form.setValue('price', preset.price);
                        form.setValue('imageUrl', preset.imageUrl);
                        form.setValue('description', preset.description);
                      }}
                      className="px-2 py-0.5 text-[11px] rounded-lg bg-background border border-orange-300 dark:border-orange-800 text-gray-800 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-950/60 font-medium transition-colors cursor-pointer"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tên */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name" className="text-xs font-bold">
                  Tên nguyên liệu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Phô mai Mozzarella, Xúc xích Pepperoni..."
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Danh mục */}
              <div className="space-y-1.5">
                <Label htmlFor="categoryId" className="text-xs font-bold">
                  Thuộc danh mục <span className="text-destructive">*</span>
                </Label>
                <select
                  id="categoryId"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  {...form.register('categoryId', { valueAsNumber: true })}
                >
                  <option value={0}>-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.categoryId && (
                  <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
                )}
              </div>

              {/* Đơn giá */}
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold">
                  Đơn giá cộng thêm (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="25000"
                  {...form.register('price')}
                />
                {form.formState.errors.price && (
                  <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>

              {/* URL Hình ảnh */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="imageUrl" className="text-xs font-bold">
                  URL Hình ảnh topping <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  {...form.register('imageUrl')}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="description" className="text-xs font-bold">
                  Mô tả ngắn
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả về topping hoặc nguyên liệu này..."
                  rows={2}
                  {...form.register('description')}
                />
              </div>

              {/* Thứ tự */}
              <div className="space-y-1.5">
                <Label htmlFor="sortOrder" className="text-xs font-bold">
                  Thứ tự hiển thị
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...form.register('sortOrder')}
                />
              </div>

              {/* Trạng thái */}
              <div className="space-y-1.5">
                <Label htmlFor="isActive" className="text-xs font-bold">
                  Trạng thái
                </Label>
                <select
                  id="isActive"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  {...form.register('isActive', { valueAsNumber: true })}
                >
                  <option value={1}>Đang hoạt động</option>
                  <option value={0}>Tạm ẩn</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="cursor-pointer"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editId ? 'Lưu thay đổi' : 'Tạo nguyên liệu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
