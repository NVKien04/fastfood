'use client';

import { useTranslation } from 'react-i18next';
import { BellOff } from 'lucide-react';

export const NotificationEmpty = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center select-none">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 flex items-center justify-center mb-3">
        <BellOff className="w-7 h-7" />
      </div>
      <h4 className="text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1">{t('NOTIFICATION.EMPTY_TITLE')}</h4>
      <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-65 leading-relaxed">
        {t(
          'NOTIFICATION.EMPTY_DESC',
          'Bạn đã xem hết tất cả thông báo. Hãy đón chờ các ưu đãi và cập nhật mới nhất nhé!',
        )}
      </p>
    </div>
  );
};
