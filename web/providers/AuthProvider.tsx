'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/stores';
import { ApiMain } from '@/services/apis/main/api.main';

interface AuthProviderProps {
  children: ReactNode;
}

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
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          {/* Logo badge with pulse */}
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ff6900] flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
              </svg>
            </div>
            <div className="absolute -inset-1.5 rounded-2xl border-2 border-orange-500/20 border-t-[#ff6900] animate-spin pointer-events-none" />
          </div>

          {/* Loading label */}
          <p
            suppressHydrationWarning
            className="text-xs font-semibold tracking-wide text-gray-500 dark:text-zinc-400 animate-pulse"
          >
            {t('COMMON.INITIALIZING')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
