'use client';

import { FC } from 'react';
import { Camera, Loader2, Trash2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAvatarUpload } from './hooks/useAvatarUpload';

type AvatarUploadProps = {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange?: (newUrl: string) => void;
};

export const AvatarUpload: FC<AvatarUploadProps> = ({
  currentAvatar,
  userName = 'User',
  onAvatarChange,
}) => {
  const {
    fileInputRef,
    selectedFile,
    message,
    loading,
    activeAvatarUrl,
    handleFileSelect,
    handleUpload,
    handleCancel,
    handleRemoveAvatar,
  } = useAvatarUpload(currentAvatar, onAvatarChange);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display Container */}
      <div className="relative group">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/50 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center relative transition-colors">
          {activeAvatarUrl ? (
            <img
              src={activeAvatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white text-3xl font-black uppercase">
              {userName.charAt(0) || 'U'}
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Change Picture Trigger Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Chọn ảnh đại diện mới"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload/Cancel Actions when File is Selected */}
      {selectedFile && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
          <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium truncate max-w-[200px]">
            {selectedFile.name}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={loading}
              onClick={handleUpload}
              className="h-8 px-3 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
              Lưu ảnh
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={handleCancel}
              className="h-8 px-3 rounded-xl text-xs font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-700 cursor-pointer"
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Remove Avatar Option if already has one & no new selection */}
      {!selectedFile && activeAvatarUrl && (
        <button
          type="button"
          disabled={loading}
          onClick={handleRemoveAvatar}
          className="text-xs text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 font-medium disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Gỡ ảnh đại diện</span>
        </button>
      )}

      {/* Status Messages */}
      {message && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};
