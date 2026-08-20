'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';
import { loginSchema } from '../utils/auth.schema';
import { LoginFormValues } from '../types';

export const useLogin = () => {
  const router = useRouter();
  const setAccessToken = useStore((s) => s.setAccessToken);
  const setUser = useStore((s) => s.setUser);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await ApiMain.instance.auth.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (response.kind === 'ERROR') {
        throw new Error(response.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }

      if (!response.data?.accessToken) {
        throw new Error('Đăng nhập thất bại.');
      }

      return response.data;
    },
    onSuccess: async (data) => {
      // 1. Lưu token vào store
      setAccessToken(data.accessToken);

      // 2. Fetch thông tin profile người dùng
      try {
        const profileRes = await ApiMain.instance.user.getProfile();
        if (profileRes.kind === 'OK' && profileRes.data) {
          const userData = profileRes.data;
          setUser({
            id: userData.id,
            email: userData.email,
            fullName: userData.name,
            avatar: userData.avatar ?? undefined,
            roles: userData.role ? [userData.role] : [],
          });
        }
      } catch {
        // Bỏ qua lỗi fetch profile nếu có
      }

      // 3. Chuyển hướng về trang chủ
      router.push('/');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    },
  });

  const _handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const _handleLoginSubmit = useCallback(
    (values: LoginFormValues) => {
      setErrorMessage('');
      mutation.mutate(values);
    },
    [mutation],
  );

  const _handleSubmit = form.handleSubmit(_handleLoginSubmit);

  return {
    form,
    onSubmit: _handleSubmit,
    isLoading: mutation.isPending,
    errorMessage,
    showPassword,
    handleTogglePassword: _handleTogglePassword,
  };
};
