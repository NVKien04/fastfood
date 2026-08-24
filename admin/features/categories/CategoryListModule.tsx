'use client';

import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { CATEGORY_LIST } from '@/constants';
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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được trống'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoryListModule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [CATEGORY_LIST],
    queryFn: () => ApiMain.instance.category.getCategories({ page: 1, limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => ApiMain.instance.category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
      setDialogOpen(false);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiMain.instance.category.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] }),
  });

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', sortOrder: 0 },
  });

  const categories = data?.kind === 'OK' ? data.data : [];

  const onSubmit = (formData: CategoryFormData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('CATEGORIES.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} danh mục</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={() => { setEditId(null); form.reset(); }}>
                <Plus className="mr-2 h-4 w-4" /> {t('CATEGORIES.CREATE')}
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? t('CATEGORIES.EDIT') : t('CATEGORIES.CREATE')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('CATEGORIES.NAME')}</Label>
                <Input {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('CATEGORIES.DESCRIPTION')}</Label>
                <Textarea {...form.register('description')} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t('CATEGORIES.SORT_ORDER')}</Label>
                <Input type="number" {...form.register('sortOrder')} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('COMMON.CANCEL')}
                </Button>
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
                <TableHead className="w-16">ID</TableHead>
                <TableHead>{t('CATEGORIES.NAME')}</TableHead>
                <TableHead>{t('CATEGORIES.SLUG')}</TableHead>
                <TableHead className="text-center">{t('CATEGORIES.SORT_ORDER')}</TableHead>
                <TableHead className="text-center">{t('COMMON.STATUS')}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {t('COMMON.NO_DATA')}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm">{category.id}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug || '—'}</TableCell>
                    <TableCell className="text-center">{category.sortOrder ?? 0}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? t('COMMON.ACTIVE') : t('COMMON.INACTIVE')}
                      </Badge>
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
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> {t('COMMON.EDIT')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(category.id)}
                          >
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
        </CardContent>
      </Card>
    </div>
  );
};
