'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '@/stores';
import { useUserProfile } from '@/services/react-query/queries/user';
import { useUpdateProfile } from '@/services/react-query/mutations/user';
import { profileSchema } from '../utils/profile.schema';
import { ProfileFormValues } from '../types';

export const useProfile = () => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const { data: profileData, isLoading: isProfileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  // Sync form inputs when query data loads
  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || '',
        phone: profileData.phone || '',
      });

      // Sync Zustand store
      const currentUser = useStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          fullName: profileData.name || currentUser.fullName,
          avatar: profileData.avatar || currentUser.avatar,
        });
      }
    }
  }, [profileData, form, setUser]);

  // Callback xử lý submit form
  const _handleSaveProfile = useCallback(
    (values: ProfileFormValues) => {
      setStatusMessage(null);

      updateProfileMutation.mutate(
        {
          name: values.name.trim(),
          phone: values.phone?.trim() || undefined,
        },
        {
          onSuccess: (data) => {
            if (data) {
              setStatusMessage({
                type: 'success',
                text: 'Cập nhật thông tin tài khoản thành công!',
              });
              // Update local state
              const currentUser = useStore.getState().user;
              if (currentUser) {
                setUser({
                  ...currentUser,
                  fullName: data.name || currentUser.fullName,
                });
              }
            } else {
              setStatusMessage({
                type: 'error',
                text: 'Cập nhật thông tin thất bại. Vui lòng thử lại.',
              });
            }
          },
          onError: (error: Error) => {
            setStatusMessage({
              type: 'error',
              text: error.message || 'Cập nhật thông tin thất bại.',
            });
          },
        },
      );
    },
    [updateProfileMutation, setUser],
  );

  const _handleSubmit = form.handleSubmit(_handleSaveProfile);

  return {
    form,
    user,
    profileData,
    isProfileLoading,
    isUpdating: updateProfileMutation.isPending,
    statusMessage,
    onSubmit: _handleSubmit,
  };
};
