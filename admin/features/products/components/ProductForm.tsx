'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  DollarSign,
  Loader2,
  Utensils,
} from 'lucide-react';
import { toast } from 'sonner';

import { ApiMain } from '@/services/apis/main/api.main';
import { CATEGORY_LIST, PRODUCT_LIST, INGREDIENT_LIST } from '@/constants';
import { SizeEnum, TypeEnum } from '@/services/apis/main/generated/data-contracts';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const productVariantSchema = z.object({
  name: z.string().min(1, 'Tên biến thể không được để trống'),
  size: z.nativeEnum(SizeEnum).default(SizeEnum.Value25Cm),
  type: z.nativeEnum(TypeEnum).default(TypeEnum.MEDIUM),
  modifiedPrice: z.coerce.number().min(0, 'Giá cộng thêm phải >= 0').default(0),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.number().default(1),
});

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional().default(''),
  basePrice: z.coerce.number().min(1000, 'Giá gốc tối thiểu 1.000đ'),
  categoryId: z.coerce.number().min(1, 'Vui lòng chọn danh mục'),
  img: z.string().min(1, 'Vui lòng nhập URL hình ảnh món ăn'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.coerce.number().default(0),
  isActive: z.coerce.number().default(1),
  variants: z.array(productVariantSchema).default([]),
});

export type ProductFormData = z.input<typeof productSchema>;

type ProductFormProps = {
  initialData?: ProductFormData;
  productId?: string;
  isEdit?: boolean;
};

export const ProductForm = ({ initialData, productId, isEdit = false }: ProductFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const { data: ingredientsData } = useQuery({
    queryKey: [INGREDIENT_LIST],
    queryFn: () => ApiMain.instance.ingredient.getIngredients({ limit: 100 }),
  });

  const categories =
    categoriesData?.kind === 'OK' && Array.isArray(categoriesData.data)
      ? categoriesData.data
      : [];

  const ingredients =
    ingredientsData?.kind === 'OK' && Array.isArray(ingredientsData.data)
      ? ingredientsData.data
      : [];

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      basePrice: 150000,
      categoryId: categories.length > 0 ? categories[0].id : 0,
      img: '',
      sortOrder: 0,
      isFeatured: 0,
      isActive: 1,
      variants: [
        {
          name: 'Size M (25cm)',
          size: SizeEnum.Value25Cm,
          type: TypeEnum.MEDIUM,
          modifiedPrice: 0,
          sortOrder: 0,
          isActive: 1,
        },
        {
          name: 'Size L (30cm)',
          size: SizeEnum.Value30Cm,
          type: TypeEnum.LARGE,
          modifiedPrice: 50000,
          sortOrder: 1,
          isActive: 1,
        },
      ],
    },
  });

  // Khi có initialData từ API chi tiết
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const imgUrl = form.watch('img');

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      ApiMain.instance.product.create({
        name: data.name,
        description: data.description || undefined,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        img: data.img,
        sortOrder: data.sortOrder,
        isFeatured: data.isFeatured,
        variants: (data.variants || []).map((v) => ({
          name: v.name,
          size: v.size || SizeEnum.Value25Cm,
          type: v.type || TypeEnum.MEDIUM,
          modifiedPrice: v.modifiedPrice || 0,
          sortOrder: v.sortOrder || 0,
        })),
      }),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Tạo sản phẩm thành công');
        queryClient.invalidateQueries({ queryKey: [PRODUCT_LIST] });
        router.push('/products');
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      ApiMain.instance.product.update(productId!, {
        name: data.name,
        description: data.description || undefined,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        img: data.img,
        sortOrder: data.sortOrder,
        isFeatured: data.isFeatured,
        variants: (data.variants || []).map((v) => ({
          name: v.name,
          size: v.size || SizeEnum.Value25Cm,
          type: v.type || TypeEnum.MEDIUM,
          modifiedPrice: v.modifiedPrice || 0,
          sortOrder: v.sortOrder || 0,
        })),
      }),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Cập nhật sản phẩm thành công');
        queryClient.invalidateQueries({ queryKey: [PRODUCT_LIST] });
        router.push('/products');
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi cập nhật sản phẩm');
      }
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (isEdit && productId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push('/products')}
            className="rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cấu hình thông tin món ăn, định giá, kích thước biến thể và phân loại danh mục
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/products')}
            disabled={isPending}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} className="cursor-pointer">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật món ăn' : 'Lưu sản phẩm'}
          </Button>
        </div>
      </div>

      {/* Two Column Layout (70% Main - 30% Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Main Form (8 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff6900]" /> Thông tin chung
              </CardTitle>
              <CardDescription className="text-xs">
                Tên món ăn và phần mô tả thành phần món
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold">
                  Tên sản phẩm <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Pizza Hải Sản Sốt Pesto, Pizza Bò Bít Tết..."
                  className="font-medium"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold">
                  Mô tả chi tiết
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả hương vị, nguyên liệu đặc trưng của món ăn này..."
                  rows={4}
                  {...form.register('description')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Giá cơ bản */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Giá bán tiêu chuẩn
              </CardTitle>
              <CardDescription className="text-xs">
                Giá gốc áp dụng cho kích cỡ mặc định (Size tiêu chuẩn)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 max-w-sm">
                <Label htmlFor="basePrice" className="text-xs font-bold">
                  Giá gốc tiêu chuẩn (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  min={1000}
                  step={1000}
                  placeholder="180000"
                  className="font-bold text-base"
                  {...form.register('basePrice')}
                />
                {form.formState.errors.basePrice && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.basePrice.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Quản lý Biến thể (Variants - Size / Kiểu đế) */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff6900]" /> Biến thể món ăn (Kích cỡ & Kiểu đế)
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Khách hàng có thể chọn kích cỡ hoặc kiểu đế tương ứng kèm giá chênh lệch
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: `Size XL (35cm)`,
                    size: SizeEnum.Value35Cm,
                    type: TypeEnum.LARGE,
                    modifiedPrice: 90000,
                    sortOrder: fields.length,
                    isActive: 1,
                  })
                }
                className="cursor-pointer text-xs"
              >
                <Plus className="mr-1.5 w-3.5 h-3.5" /> Thêm biến thể
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.length === 0 ? (
                <div className="p-6 text-center border border-dashed rounded-xl text-muted-foreground text-xs">
                  Chưa có biến thể nào. Món ăn sẽ chỉ bán theo 1 kích cỡ chuẩn theo Giá gốc.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                        {/* Tên biến thể */}
                        <div>
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                            Tên hiển thị
                          </Label>
                          <Input
                            placeholder="VD: Size M (25cm)"
                            className="h-8 text-xs font-medium mt-1"
                            {...form.register(`variants.${index}.name`)}
                          />
                        </div>

                        {/* Kích thước Enum */}
                        <div>
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                            Kích cỡ
                          </Label>
                          <select
                            className="w-full h-8 px-2.5 mt-1 rounded-md border border-input bg-background text-xs"
                            {...form.register(`variants.${index}.size`)}
                          >
                            <option value={SizeEnum.Value20Cm}>20cm (Nhỏ)</option>
                            <option value={SizeEnum.Value25Cm}>25cm (Vừa - M)</option>
                            <option value={SizeEnum.Value30Cm}>30cm (Lớn - L)</option>
                            <option value={SizeEnum.Value35Cm}>35cm (Đặc biệt - XL)</option>
                          </select>
                        </div>

                        {/* Giá chênh lệch */}
                        <div>
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                            Giá cộng thêm (+VNĐ)
                          </Label>
                          <Input
                            type="number"
                            step={1000}
                            min={0}
                            placeholder="0"
                            className="h-8 text-xs font-bold mt-1 text-[#ff6900]"
                            {...form.register(`variants.${index}.modifiedPrice`)}
                          />
                        </div>
                      </div>

                      {/* Xóa */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer self-end sm:self-center"
                        title="Xóa biến thể"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Danh sách Topping / Nguyên liệu có thể chọn thêm */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#ff6900]" /> Topping & Nguyên liệu gọi thêm
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Các loại topping có sẵn trong kho nguyên liệu mà khách hàng có thể chọn thêm cho món này
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push('/ingredients')}
                className="text-xs text-[#ff6900] hover:text-[#ff6900]/80 cursor-pointer"
              >
                Quản lý kho Topping →
              </Button>
            </CardHeader>
            <CardContent>
              {ingredients.length === 0 ? (
                <div className="p-6 text-center border border-dashed rounded-xl text-muted-foreground text-xs space-y-2">
                  <p>Chưa có nguyên liệu / topping nào trong hệ thống.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/ingredients')}
                    className="cursor-pointer text-xs"
                  >
                    + Đi đến trang tạo Topping
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/40 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted border border-border/80 flex items-center justify-center shrink-0">
                        {ing.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={ing.imageUrl}
                            alt={ing.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Utensils className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {ing.name}
                        </p>
                        <p className="text-[11px] text-[#ff6900] font-semibold">
                          +{formatCurrency(ing.price || 0)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 shrink-0 bg-muted text-muted-foreground"
                      >
                        {ing.isActive ? 'Sẵn sàng' : 'Tạm hết'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Sidebar Attributes (4 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 4: Danh mục & Phân loại */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Danh mục & Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chọn Danh mục */}
              <div className="space-y-1.5">
                <Label htmlFor="categoryId" className="text-xs font-bold">
                  Danh mục cha <span className="text-destructive">*</span>
                </Label>
                <select
                  id="categoryId"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
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
                  <p className="text-xs text-destructive">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Trạng thái mở bán */}
              <div className="space-y-1.5">
                <Label htmlFor="isActive" className="text-xs font-bold">
                  Trạng thái kinh doanh
                </Label>
                <select
                  id="isActive"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                  {...form.register('isActive', { valueAsNumber: true })}
                >
                  <option value={1}>Đang mở bán (Hiển thị)</option>
                  <option value={0}>Tạm ngưng bán (Ẩn)</option>
                </select>
              </div>

              {/* Đánh dấu nổi bật */}
              <div className="space-y-1.5">
                <Label htmlFor="isFeatured" className="text-xs font-bold">
                  Món ăn nổi bật (Best Seller / Hot)
                </Label>
                <select
                  id="isFeatured"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
                  {...form.register('isFeatured', { valueAsNumber: true })}
                >
                  <option value={0}>Món ăn bình thường</option>
                  <option value={1}>⭐ Đánh dấu Món Nổi Bật</option>
                </select>
              </div>

              {/* Thứ tự hiển thị */}
              <div className="space-y-1.5">
                <Label htmlFor="sortOrder" className="text-xs font-bold">
                  Thứ tự ưu tiên hiển thị
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...form.register('sortOrder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Hình ảnh món ăn */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="img" className="text-xs font-bold">
                  URL Hình ảnh món <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="img"
                  placeholder="https://images.unsplash.com/..."
                  {...form.register('img')}
                />
                {form.formState.errors.img && (
                  <p className="text-xs text-destructive">{form.formState.errors.img.message}</p>
                )}
              </div>

              {/* Live Image Preview */}
              <div className="relative w-full aspect-video rounded-xl bg-muted/60 border border-border/80 overflow-hidden flex items-center justify-center">
                {imgUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imgUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-xs">
                    <ImageIcon className="w-6 h-6" />
                    <span>Xem trước hình ảnh</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
