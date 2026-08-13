'use client';

import * as React from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { useAuthStore } from '@/stores/auth.store';
import { Camera, Loader2, Trash2, User as UserIcon, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange?: (newUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName = 'User',
  onAvatarChange,
}) => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeAvatarUrl = previewUrl || currentAvatar || user?.avatar;

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Chỉ chấp nhận file hình ảnh (JPG, PNG, WEBP, GIF)' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Kích thước file không được vượt quá 10MB' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    // Create instant local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Upload avatar to S3 and update profile
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Upload image file to AWS S3 under 'avatars' folder
      const uploadRes = await ApiMain.instance.upload.uploadImage(selectedFile, 'avatars');

      if (uploadRes.kind === 'ERROR' || !uploadRes.data?.url) {
        throw new Error(uploadRes.kind === 'ERROR' ? uploadRes.error : 'Upload ảnh lên S3 thất bại');
      }

      const newAvatarUrl = uploadRes.data.url;

      // Step 2: Update avatar URL in user profile in DB
      const updateRes = await ApiMain.instance.user.updateProfile({
        avatar: newAvatarUrl,
      });

      if (updateRes.kind === 'ERROR') {
        throw new Error(updateRes.error);
      }

      // Step 3: Update Zustand store
      if (user) {
        setUser({ ...user, avatar: newAvatarUrl });
      }

      if (onAvatarChange) {
        onAvatarChange(newAvatarUrl);
      }

      setSelectedFile(null);
      setMessage({ type: 'success', text: 'Đã cập nhật ảnh đại diện thành công!' });
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Có lỗi xảy ra khi upload';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // Remove current avatar
  const handleRemoveAvatar = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const updateRes = await ApiMain.instance.user.updateProfile({
        avatar: '',
      });

      if (updateRes.kind === 'ERROR') {
        throw new Error(updateRes.error);
      }

      if (user) {
        setUser({ ...user, avatar: '' });
      }
      setPreviewUrl(null);
      setSelectedFile(null);
      if (onAvatarChange) {
        onAvatarChange('');
      }
      setMessage({ type: 'success', text: 'Đã xóa ảnh đại diện!' });
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa ảnh';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  // Get user initials for fallback avatar
  const initials = React.useMemo(() => {
    if (!userName) return 'U';
    const words = userName.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }, [userName]);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Avatar Image Container */}
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-red-500 via-orange-400 to-amber-300 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-red-500/25">
          <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center relative">
            {activeAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeAvatarUrl}
                alt={userName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-black text-3xl tracking-wider">
                {initials}
              </div>
            )}

            {/* Hover Overlay Icon */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1">
              <Camera className="w-7 h-7 animate-bounce" />
              <span className="text-[11px] font-bold tracking-wide">Thay đổi ảnh</span>
            </div>

            {/* Loading Spinner Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-red-600 gap-1 z-10">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-[10px] font-bold">Đang tải lên...</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Trigger Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-transform active:scale-95 group-hover:scale-110"
          title="Chọn ảnh đại diện"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3 font-medium">Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 10MB)</p>

      {/* Action Buttons when file is selected */}
      {selectedFile && (
        <div className="mt-4 flex items-center gap-2 animate-fadeIn">
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl px-4 py-2 shadow-md shadow-red-600/20 gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Lưu ảnh đại diện</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            disabled={loading}
            className="text-xs font-semibold rounded-xl border-gray-200 hover:bg-gray-50"
          >
            Hủy
          </Button>
        </div>
      )}

      {/* Delete Avatar Option */}
      {!selectedFile && activeAvatarUrl && (
        <button
          type="button"
          onClick={handleRemoveAvatar}
          disabled={loading}
          className="mt-3 text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Gỡ ảnh đại diện</span>
        </button>
      )}

      {/* Alert Status Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 max-w-sm text-left animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};
