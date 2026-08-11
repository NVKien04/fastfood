'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ApiMain } from '@/services/apis/main/api.main';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const initialized = useRef(false);

  useEffect(() => {
    // Guard chống React Strict Mode gọi 2 lần trong development
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        // Bước 1: Gọi /auth/refresh → Cookie tự gửi refreshToken
        // → Backend trả về accessToken mới
        const refreshResponse = await ApiMain.instance.auth.refreshToken();

        if (refreshResponse.kind === 'OK' && refreshResponse.data?.accessToken) {
          const token = refreshResponse.data.accessToken;
          useAuthStore.getState().setAccessToken(token);

          // Bước 2: Dùng accessToken mới để lấy thông tin user /users/me
          const profileResponse = await ApiMain.instance.user.getProfile();

          if (profileResponse.kind === 'OK' && profileResponse.data) {
            const userData = profileResponse.data;
            useAuthStore.getState().setUser({
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
        useAuthStore.getState().setInitializing(false);
        console.log('Đã khởi tạo xong AuthProvider');
      }
    };

    init();
  }, []);

  // Trong lúc đang khởi tạo (gọi refresh + lấy user info), hiển thị loading
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
          <p className="text-sm text-gray-500">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
