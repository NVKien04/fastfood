'use client';

import { useState, useRef, useCallback, ChangeEvent } from 'react';
import { useStore } from '@/stores';
import { useUploadImage } from '@/services/react-query/mutations/upload';
import { useUpdateProfile } from '@/services/react-query/mutations/user';

export const useAvatarUpload = (
  currentAvatar?: string,
  onAvatarChange?: (newUrl: string) => void,
) => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const uploadMutation = useUploadImage();
  const updateProfileMutation = useUpdateProfile();

  const loading = uploadMutation.isPending || updateProfileMutation.isPending;
  const activeAvatarUrl = previewUrl || currentAvatar || user?.avatar;

  const _handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Chỉ chấp nhận file hình ảnh (JPG, PNG, WEBP, GIF)' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Kích thước file không được vượt quá 10MB' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }, []);

  const _handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setMessage(null);

    uploadMutation.mutate(
      { file: selectedFile, folder: 'avatars' },
      {
        onSuccess: (uploadData) => {
          if (!uploadData?.url) {
            setMessage({ type: 'error', text: 'Không thể lấy URL ảnh sau khi tải lên.' });
            return;
          }

          const uploadedUrl = uploadData.url;

          updateProfileMutation.mutate(
            { avatar: uploadedUrl },
            {
              onSuccess: (profileData) => {
                if (profileData) {
                  setMessage({ type: 'success', text: 'Ảnh đại diện đã được cập nhật thành công!' });
                  setSelectedFile(null);
                  setPreviewUrl(null);

                  const currentUser = useStore.getState().user;
                  if (currentUser) {
                    setUser({ ...currentUser, avatar: uploadedUrl });
                  }

                  if (onAvatarChange) {
                    onAvatarChange(uploadedUrl);
                  }
                } else {
                  setMessage({ type: 'error', text: 'Không thể lưu ảnh đại diện vào hồ sơ.' });
                }
              },
              onError: (err: Error) => {
                setMessage({
                  type: 'error',
                  text: err.message || 'Lỗi khi cập nhật ảnh vào hồ sơ người dùng.',
                });
              },
            },
          );
        },
        onError: (err: Error) => {
          setMessage({ type: 'error', text: err.message || 'Tải ảnh lên thất bại. Vui lòng thử lại.' });
        },
      },
    );
  }, [selectedFile, uploadMutation, updateProfileMutation, setUser, onAvatarChange]);

  const _handleCancel = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const _handleRemoveAvatar = useCallback(() => {
    setMessage(null);

    updateProfileMutation.mutate(
      { avatar: '' },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: 'Đã xóa ảnh đại diện.' });
          setSelectedFile(null);
          setPreviewUrl(null);

          const currentUser = useStore.getState().user;
          if (currentUser) {
            setUser({ ...currentUser, avatar: undefined });
          }

          if (onAvatarChange) {
            onAvatarChange('');
          }
        },
        onError: (err: Error) => {
          setMessage({ type: 'error', text: err.message || 'Xóa ảnh thất bại.' });
        },
      },
    );
  }, [updateProfileMutation, setUser, onAvatarChange]);

  return {
    fileInputRef,
    previewUrl,
    selectedFile,
    message,
    loading,
    activeAvatarUrl,
    handleFileSelect: _handleFileSelect,
    handleUpload: _handleUpload,
    handleCancel: _handleCancel,
    handleRemoveAvatar: _handleRemoveAvatar,
  };
};
