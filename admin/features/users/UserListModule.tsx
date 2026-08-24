'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { USER_LIST } from '@/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export const UserListModule = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [USER_LIST, { page }],
    queryFn: () => ApiMain.instance.user.getUserPage({ page, limit: 10 }),
  });

  const users = data?.kind === 'OK' ? data.data : [];
  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('USERS.TITLE')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pagination?.totalItems ?? 0} người dùng</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('USERS.NAME')}</TableHead>
                <TableHead>{t('USERS.EMAIL')}</TableHead>
                <TableHead>{t('USERS.PHONE')}</TableHead>
                <TableHead>{t('USERS.ROLE')}</TableHead>
                <TableHead>{t('USERS.PROVIDER')}</TableHead>
                <TableHead className="text-right">{t('COMMON.CREATED_AT')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {t('COMMON.NO_DATA')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar ?? undefined} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{user.phone || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? t('USERS.ADMIN') : t('USERS.CUSTOMER')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">{user.provider}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
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
