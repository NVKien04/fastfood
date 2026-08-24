'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useStore } from '@/stores';
import { ApiMain } from '@/services/apis/main/api.main';
import { RoleEnum } from '@/constants';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isInitializing = useStore((s) => s.isInitializing);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const hasLoggedInCookie = document.cookie.split('; ').some((c) => c.startsWith('logged_in='));

    if (!hasLoggedInCookie) {
      useStore.getState().setInitializing(false);
      return;
    }

    const init = async () => {
      try {
        const refreshResponse = await ApiMain.instance.auth.refreshToken();

        if (refreshResponse.kind === 'OK' && refreshResponse.data?.accessToken) {
          const token = refreshResponse.data.accessToken;
          useStore.getState().setAccessToken(token);

          const profileResponse = await ApiMain.instance.user.getProfile();

          if (profileResponse.kind === 'OK' && profileResponse.data) {
            const userData = profileResponse.data;

            // Kiểm tra quyền admin
            if (userData.role !== RoleEnum.Admin) {
              useStore.getState().clearAuth();
              return;
            }

            useStore.getState().setUser({
              id: userData.id,
              email: userData.email,
              fullName: userData.name,
              avatar: userData.avatar ?? undefined,
              roles: userData.role ? [userData.role] : [],
            });
          }
        }
      } catch {
        // Lỗi mạng hoặc server → bỏ qua
      } finally {
        useStore.getState().setInitializing(false);
      }
    };

    init();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
