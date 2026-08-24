'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';
import { RoleEnum } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLoginModule = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      const loginResponse = await ApiMain.instance.auth.login(data);

      if (loginResponse.kind !== 'OK' || !loginResponse.data?.accessToken) {
        setError(t('AUTH.LOGIN_ERROR'));
        return;
      }

      useStore.getState().setAccessToken(loginResponse.data.accessToken);

      // Kiểm tra profile và quyền admin
      const profileResponse = await ApiMain.instance.user.getProfile();

      if (profileResponse.kind !== 'OK' || !profileResponse.data) {
        setError(t('AUTH.LOGIN_ERROR'));
        useStore.getState().clearAuth();
        return;
      }

      const userData = profileResponse.data;

      if (userData.role !== RoleEnum.Admin) {
        setError(t('AUTH.NOT_ADMIN'));
        useStore.getState().clearAuth();
        return;
      }

      useStore.getState().setUser({
        id: userData.id,
        email: userData.email,
        fullName: userData.name,
        avatar: userData.avatar ?? undefined,
        roles: [userData.role],
      });

      router.push('/');
    } catch {
      setError(t('AUTH.LOGIN_ERROR'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{t('AUTH.LOGIN_TITLE')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('AUTH.LOGIN_SUBTITLE')}</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5">
          <CardHeader className="sr-only">
            <CardTitle>{t('AUTH.LOGIN')}</CardTitle>
            <CardDescription>{t('AUTH.LOGIN_SUBTITLE')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('AUTH.EMAIL')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fastfood.vn"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('AUTH.PASSWORD')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('AUTH.LOGIN')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
