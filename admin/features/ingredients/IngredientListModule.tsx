'use client';

import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { INGREDIENT_LIST, CATEGORY_LIST } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Tên không được trống'),
  imageUrl: z.string().url('URL ảnh không hợp lệ'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  categoryId: z.coerce.number().min(1, 'Chọn danh mục'),
  sortOrder: z.coerce.number().int().min(0),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

export const IngredientListModule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [INGREDIENT_LIST, { page }],
    queryFn: () => ApiMain.instance.ingredient.getIngredients({ page, limit: 10 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: IngredientFormData) => ApiMain.instance.ingredient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INGREDIENT_LIST] });
      setDialogOpen(false);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiMain.instance.ingredient.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [INGREDIENT_LIST] }),
  });

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: { name: '', imageUrl: '', price: 0, categoryId: 0, sortOrder: 0 },
  });

  const ingredients = data?.kind === 'OK' ? data.data : [];
  const categories = categoriesData?.kind === 'OK' ? categoriesData.data : [];
  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  const onSubmit = (formData: IngredientFormData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('INGREDIENTS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination?.totalItems ?? 0} nguyên liệu</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={() => form.reset()}>
                <Plus className="mr-2 h-4 w-4" /> {t('INGREDIENTS.CREATE')}
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('INGREDIENTS.CREATE')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('INGREDIENTS.NAME')}</Label>
                <Input {...form.register('name')} />
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t('INGREDIENTS.IMAGE')} URL</Label>
                <Input {...form.register('imageUrl')} placeholder="https://..." />
                {form.formState.errors.imageUrl && <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('INGREDIENTS.PRICE')} (₫)</Label>
                  <Input type="number" {...form.register('price')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('INGREDIENTS.CATEGORY')}</Label>
                  <select {...form.register('categoryId')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value={0}>Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('COMMON.CANCEL')}</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('COMMON.SAVE')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('INGREDIENTS.IMAGE')}</TableHead>
                <TableHead>{t('INGREDIENTS.NAME')}</TableHead>
                <TableHead className="text-right">{t('INGREDIENTS.PRICE')}</TableHead>
                <TableHead className="text-center">{t('INGREDIENTS.CATEGORY')}</TableHead>
                <TableHead className="text-center">{t('COMMON.STATUS')}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>))}</TableRow>
                ))
              ) : ingredients.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">{t('COMMON.NO_DATA')}</TableCell></TableRow>
              ) : (
                ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ingredient.imageUrl} alt={ingredient.name} className="h-full w-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(ingredient.price)}</TableCell>
                    <TableCell className="text-center text-muted-foreground">ID: {ingredient.categoryId}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={ingredient.isActive ? 'default' : 'secondary'}>
                        {ingredient.isActive ? t('COMMON.ACTIVE') : t('COMMON.INACTIVE')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> {t('COMMON.EDIT')}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(ingredient.id)}>
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
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>→</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
