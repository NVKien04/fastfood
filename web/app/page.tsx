'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ApiMain } from '@/services/apis/main/api.main';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    await ApiMain.instance.auth.logout();
    useAuthStore.getState().clearAuth();
    router.push('/login');
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans min-h-screen">
      <main className="flex w-full max-w-xl flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center gap-6">

        {!accessToken ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Bạn chưa đăng nhập</h1>
            <p className="text-gray-500 mb-4">Vui lòng đăng nhập để trải nghiệm ứng dụng.</p>
            <Button
              onClick={() => router.push('/login')}
              className="bg-brand-primary hover:bg-brand-primary-active"
            >
              Đi đến trang Đăng nhập
            </Button>
          </>
        ) : (
          <>
            <div className="h-20 w-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-brand-primary">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Xin chào, {user?.fullName || 'Người dùng'}!
              </h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={() => router.push('/product')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Xem Thực Đơn Sản Phẩm 🍕
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-gray-200 hover:bg-gray-50"
              >
                Đăng xuất
              </Button>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
