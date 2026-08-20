'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';
import { registerSchema } from '../utils/auth.schema';
import { RegisterFormValues, AuthStep } from '../types';

export const useRegister = () => {
  const router = useRouter();
  const setAccessToken = useStore((s) => s.setAccessToken);
  const setUser = useStore((s) => s.setUser);

  const [currentStep, setCurrentStep] = useState<AuthStep>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      phone: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const formattedPhone = values.phone.startsWith('+84')
        ? '0' + values.phone.slice(3)
        : values.phone;

      const response = await ApiMain.instance.auth.register({
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
        phone: formattedPhone.trim(),
        provider: 'local',
      });

      if (response.kind === 'ERROR') {
        throw new Error(response.error || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }

      // Tự động đăng nhập sau khi tạo tài khoản
      try {
        const loginRes = await ApiMain.instance.auth.login({
          email: values.email.trim(),
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
      setIsSuccess(true);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || 'Đã có lỗi xảy ra khi tạo tài khoản.');
    },
  });

  const _handleNextStep1 = useCallback(async () => {
    const isStep1Valid = await form.trigger(['phone', 'email']);
    if (isStep1Valid) {
      setErrorMessage('');
      setCurrentStep(2);
    }
  }, [form]);

  const _handleNextStep2 = useCallback(async () => {
    const isStep2Valid = await form.trigger(['name', 'password', 'confirmPassword']);
    if (isStep2Valid) {
      setErrorMessage('');
      setCurrentStep(3);
    }
  }, [form]);

  const _handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as AuthStep);
    } else {
      router.push('/login');
    }
  }, [currentStep, router]);

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
    currentStep,
    setCurrentStep,
    handleNextStep1: _handleNextStep1,
    handleNextStep2: _handleNextStep2,
    handlePrevStep: _handlePrevStep,
    onSubmit: _handleSubmit,
    isLoading: mutation.isPending,
    errorMessage,
    isSuccess,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
