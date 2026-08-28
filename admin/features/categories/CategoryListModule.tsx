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
  Layers,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { ApiMain } from '@/services/apis/main/api.main';
import { CATEGORY_LIST } from '@/constants';
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

const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0, 'Thứ tự phải lớn hơn hoặc bằng 0'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoryListModule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const categories = useMemo(() => {
    return data?.kind === 'OK' && Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', sortOrder: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (formData: CategoryFormData) => ApiMain.instance.category.create(formData),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Tạo danh mục thành công');
        queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
        setDialogOpen(false);
        form.reset();
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi tạo danh mục');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Có lỗi xảy ra');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: CategoryFormData }) =>
      ApiMain.instance.category.update(id, formData),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Cập nhật danh mục thành công');
        queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
        setDialogOpen(false);
        setEditId(null);
        form.reset();
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi cập nhật danh mục');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Có lỗi xảy ra');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiMain.instance.category.delete(id),
    onSuccess: (res) => {
      if (res.kind === 'OK') {
        toast.success('Xóa danh mục thành công');
        queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
      } else {
        toast.error(res.error || 'Có lỗi xảy ra khi xóa danh mục');
      }
    },
  });

  // Khi chọn sửa danh mục
  const handleOpenEdit = (category: (typeof categories)[0]) => {
    setEditId(category.id);
    form.reset({
      name: category.name || '',
      description: category.description || '',
      sortOrder: category.sortOrder ?? 0,
    });
    setDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setEditId(null);
    form.reset({
      name: '',
      description: '',
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = (formData: CategoryFormData) => {
    if (editId) {
      updateMutation.mutate({ id: editId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Lọc tìm kiếm danh mục
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.slug && c.slug.toLowerCase().includes(term)) ||
        (c.description && c.description.toLowerCase().includes(term)),
    );
  }, [categories, searchTerm]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => Boolean(c.isActive)).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('CATEGORIES.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các nhóm danh mục món ăn (Pizza, Gà rán, Mì Ý, Đồ uống, Khai vị)
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> {t('CATEGORIES.CREATE')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng số danh mục</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tạm ẩn</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{stats.inactive}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm danh mục theo tên, slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Đường dẫn (Slug)</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center">Thứ tự</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="w-16 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{category.id}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {category.slug || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {category.description || '—'}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {category.sortOrder ?? 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={category.isActive ? 'default' : 'secondary'}
                        className={
                          category.isActive
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30'
                            : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }
                      >
                        {category.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                      </Badge>
                    </TableCell>
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
                            onClick={() => handleOpenEdit(category)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
                                deleteMutation.mutate(category.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Form Tạo / Sửa Danh mục */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Pizza Truyền Thống, Gà Rán Giòn..."
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-bold">
                Mô tả
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn gọn về danh mục này..."
                rows={3}
                {...form.register('description')}
              />
            </div>

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
              <p className="text-[11px] text-muted-foreground">
                Số càng nhỏ thì danh mục sẽ ưu tiên hiển thị trước
              </p>
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
                {editId ? 'Lưu thay đổi' : 'Tạo danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
