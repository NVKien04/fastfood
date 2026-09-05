'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/stores';
import { ApiMain } from '@/services/apis/main/api.main';
import { Loading } from '@/components/Loading';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation();
  const isInitializing = useStore((s) => s.isInitializing);
  const initialized = useRef(false);

  useEffect(() => {
    // Guard chống React Strict Mode gọi 2 lần trong development
    if (initialized.current) return;
    initialized.current = true;

    const hasLoggedInCookie = document.cookie.split('; ').some((c) => c.startsWith('logged_in='));

    // Nếu chưa từng đăng nhập (cookie logged_in không tồn tại) → bỏ qua refresh
    if (!hasLoggedInCookie) {
      useStore.getState().setInitializing(false);
      return;
    }

    const init = async () => {
      try {
        // Bước 1: Gọi /auth/refresh → Cookie tự gửi refreshToken
        // → Backend trả về accessToken mới
        const refreshResponse = await ApiMain.instance.auth.refreshToken();

        if (refreshResponse.kind === 'OK' && refreshResponse.data?.accessToken) {
          const token = refreshResponse.data.accessToken;
          useStore.getState().setAccessToken(token);

          // Bước 2: Dùng accessToken mới để lấy thông tin user /users/me
          const profileResponse = await ApiMain.instance.user.getProfile();

          if (profileResponse.kind === 'OK' && profileResponse.data) {
            const userData = profileResponse.data;
            useStore.getState().setUser({
              id: userData.id,
              email: userData.email,
              fullName: userData.name,
              avatar: userData.avatar ?? undefined,
              roles: userData.role ? [userData.role] : [],
            });
          }
        }
        // Nếu refresh thất bại (cookie hết hạn, chưa đăng nhập lần nào)
        // → Không làm gì, user sẽ là null, accessToken sẽ là null
        // → Ứng dụng hiển thị trạng thái chưa đăng nhập
      } catch {
        // Lỗi mạng hoặc server chết → bỏ qua, để user ở trạng thái chưa đăng nhập
      } finally {
        // Bước 3: Dù thành công hay thất bại, đánh dấu đã khởi tạo xong
        useStore.getState().setInitializing(false);
      }
    };

    init();
  }, []);

  // Trong lúc đang khởi tạo (gọi refresh + lấy user info), hiển thị loading
  if (isInitializing) {
    return <Loading fullScreen size="lg" text={t('COMMON.INITIALIZING')} />;
  }

  return <>{children}</>;
}
