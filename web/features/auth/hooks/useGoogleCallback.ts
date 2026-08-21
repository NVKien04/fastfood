'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';

export const useGoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useStore((s) => s.setAccessToken);
  const setUser = useStore((s) => s.setUser);

  const [isProcessingGoogle, setIsProcessingGoogle] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setGoogleError('Đăng nhập với Google thất bại. Vui lòng thử lại.');
      return;
    }

    if (!token) {
      return;
    }

    let isMounted = true;

    const handleOAuthSuccess = async () => {
      setIsProcessingGoogle(true);
      try {
        setAccessToken(token);

        // Fetch thông tin profile người dùng
        const profileRes = await ApiMain.instance.user.getProfile();
        if (isMounted && profileRes.kind === 'OK' && profileRes.data) {
          const userData = profileRes.data;
          setUser({
            id: userData.id,
            email: userData.email,
            fullName: userData.name,
            avatar: userData.avatar ?? undefined,
            roles: userData.role ? [userData.role] : [],
          });
        }

        if (isMounted) {
          router.replace('/');
        }
      } catch {
        if (isMounted) {
          setGoogleError('Không thể lấy thông tin tài khoản. Vui lòng thử lại.');
        }
      } finally {
        if (isMounted) {
          setIsProcessingGoogle(false);
        }
      }
    };

    handleOAuthSuccess();

    return () => {
      isMounted = false;
    };
  }, [searchParams, setAccessToken, setUser, router]);

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_MAIN_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return {
    isProcessingGoogle,
    googleError,
    handleGoogleLogin,
  };
};
