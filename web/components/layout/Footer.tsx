'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2 } from 'lucide-react';

type FooterProps = {
  className?: string;
};

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  // 1. Next.js Router & navigation hooks (none needed)

  // 2. Translation hook (none needed or static strings)

  // 3. Local state & refs (none needed)

  // 4. Zustand global state (none needed)

  // 5. React Query hooks (none needed)

  // 6. Memoized values (useMemo)
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);

  // 7. Effects (none needed)

  // 8. Event handlers & internal functions (none needed)

  // 9. Return JSX
  return (
    <footer className={`w-full max-w-7xl mx-auto px-4 pt-10 pb-8 ${className}`}>
      {/* Upper Rounded Container Box */}
      <div className="bg-[#f5f5f5] rounded-3xl p-8 sm:p-10 lg:p-12 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Social Links */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
                </svg>
              </div>
              <span className="text-2xl font-black italic tracking-tight text-gray-900 leading-none">
                Pizza<span className="text-red-600">Hut</span>
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Gmail / Mail */}
              <a
                href="mailto:contact@pizzahut.vn"
                aria-label="Email"
                className="w-8 h-8 rounded-full bg-white text-red-600 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Về chúng tôi */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Về chúng tôi</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-600">
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Tầm nhìn và sứ mệnh của chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Giá trị cốt lõi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  An toàn thực phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  LIMO
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Cơ hội nghề nghiệp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Vị trí cửa hàng */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Vị trí cửa hàng</h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-600">
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Miền Bắc
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Miền Trung
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-600 transition-colors">
                  Miền Nam
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Tải ứng dụng */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Tải ứng dụng</h4>
            <div className="flex flex-col gap-2.5">
              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-3.5 py-2 rounded-xl hover:bg-gray-800 transition-colors max-w-[150px]"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.368-.31-.61-.77-.61-1.327V3.14c0-.557.242-1.017.61-1.326zM15.207 13.414l2.766 2.766-12.78 7.377 10.014-10.143zm0-2.828L5.193.443l12.78 7.377-2.766 2.766zM18.89 11.23l2.84 1.639c.62.358.62.942 0 1.3l-2.84 1.639-2.05-2.05 2.05-2.05z" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8px] uppercase tracking-wider text-gray-300 font-medium">TẢI VỀ TRÊN</span>
                  <span className="text-[11px] font-bold mt-0.5">Google Play</span>
                </div>
              </a>

              {/* App Store */}
              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-3.5 py-2 rounded-xl hover:bg-gray-800 transition-colors max-w-[150px]"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.64 1.36-.56.65-1.06 1.71-.93 2.74 1.02.08 2.05-.48 2.65-1.23" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8px] uppercase tracking-wider text-gray-300 font-medium">TẢI VỀ TRÊN</span>
                  <span className="text-[11px] font-bold mt-0.5">App Store</span>
                </div>
              </a>

              {/* Bộ Công Thương Seal Badge */}
              <div className="inline-flex items-center gap-2 bg-[#0074d9]/10 border border-[#0074d9]/30 rounded-xl px-3 py-1.5 max-w-[170px]">
                <CheckCircle2 className="w-4 h-4 text-[#0074d9] shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] font-extrabold text-[#0074d9] uppercase tracking-wider">ĐÃ THÔNG BÁO</span>
                  <span className="text-[8px] font-semibold text-gray-600 mt-0.5">BỘ CÔNG THƯƠNG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium px-2">
        <div>
          <span>Phiên bản 2.1.2</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link href="#" className="hover:text-red-600 transition-colors">
            Hut Rewards
          </Link>
          <Link href="#" className="hover:text-red-600 transition-colors">
            Điều khoản và quyền lợi
          </Link>
          <a href="tel:19001822" className="text-red-600 font-bold hover:underline">
            Liên hệ chúng tôi 1900 1822
          </a>
        </div>
      </div>
    </footer>
  );
};
