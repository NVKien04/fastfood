'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';
import { registerSchema } from '../utils/auth.schema';
import { RegisterFormValues } from '../types';

export const useRegister = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const setAccessToken = useStore((s) => s.setAccessToken);
  const setUser = useStore((s) => s.setUser);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const rawInput = values.email.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawInput);
      const isPhone = /^(0|\+84)[0-9]{8,10}$/.test(rawInput.replace(/\s+/g, ''));

      let email = rawInput;
      let phone: string | undefined = undefined;
      let name = rawInput;

      if (isEmail) {
        email = rawInput;
        name = rawInput.split('@')[0];
      } else if (isPhone) {
        phone = rawInput.startsWith('+84') ? '0' + rawInput.slice(3) : rawInput;
        email = `${phone}@fastfood.vn`;
        name = phone;
      }

      const response = await ApiMain.instance.auth.register({
        email,
        password: values.password,
        name,
        phone,
        provider: 'local',
      });

      if (response.kind === 'ERROR') {
        throw new Error(response.error || t('AUTH.REGISTER_FAILED'));
      }

      // Tự động đăng nhập sau khi tạo tài khoản
      try {
        const loginRes = await ApiMain.instance.auth.login({
          email,
          password: values.password,
        });

        if (loginRes.kind === 'OK' && loginRes.data?.accessToken) {
          setAccessToken(loginRes.data.accessToken);

          const profileResponse = await ApiMain.instance.user.getProfile();
          if (profileResponse.kind === 'OK' && profileResponse.data) {
            const userData = profileResponse.data;
            setUser({
              id: userData.id,
              email: userData.email,
              fullName: userData.name,
              avatar: userData.avatar ?? undefined,
              roles: userData.role ? [userData.role] : [],
            });
          }
        }
      } catch {
        // Bỏ qua lỗi auto login nếu có
      }

      return response.data;
    },
    onSuccess: () => {
      router.push('/');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || t('AUTH.REGISTER_FAILED'));
    },
  });

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const _handleRegisterSubmit = useCallback(
    (values: RegisterFormValues) => {
      setErrorMessage('');
      mutation.mutate(values);
    },
    [mutation],
  );

  const _handleSubmit = form.handleSubmit(_handleRegisterSubmit);

  return {
    form,
    onSubmit: _handleSubmit,
    isLoading: mutation.isPending,
    errorMessage,
    showPassword,
    handleTogglePassword,
  };
};
