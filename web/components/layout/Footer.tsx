'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Check } from 'lucide-react';

type FooterProps = {
  className?: string;
};

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer
      className={`w-full bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 transition-colors ${className}`}
    >
      <div className="max-w-[1200px] w-full mx-auto px-4 pt-14 pb-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-gray-100 dark:border-zinc-800">
          {/* ======================================================== */}
          {/* Column 1: Brand & Contact Info (4 cols)                  */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* Brand Title */}
            <Link href="/" className="inline-block">
              <span className="text-2xl sm:text-[26px] font-black tracking-tight text-gray-900 dark:text-white leading-none">
                Kei<span className="text-[#ff6900]">Pizza</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Chuỗi nhà hàng pizza và thức ăn nhanh tiện lợi hàng đầu, chất lượng và đáng tin cậy. Mang hương vị pizza tươi hảo hạng đến hàng triệu khách hàng trên toàn quốc.
            </p>

            {/* Contact Details */}
            <div className="space-y-2.5 pt-1 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                <span>Tòa nhà KeiPizza, Đường Trương Định, Tương Mai, Hoàng Mai, Hà Nội</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ff6900] shrink-0" />
                <span>Hotline: <strong className="text-gray-900 dark:text-zinc-200">1900 1822</strong> (8:00 - 22:00)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ff6900] shrink-0" />
                <span>Email: <a href="mailto:support@keipizza.vn" className="text-gray-900 dark:text-zinc-200 hover:text-[#ff6900] transition-colors">support@keipizza.vn</a></span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-zinc-300 mb-3">
                KẾT NỐI VỚI CHÚNG TÔI
              </h5>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-[#ff6900] hover:text-white dark:hover:bg-[#ff6900] dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-[#ff6900] hover:text-white dark:hover:bg-[#ff6900] dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-[#ff6900] hover:text-white dark:hover:bg-[#ff6900] dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Column 2: MUA SẮM (2.5 cols)                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              MUA SẮM
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-[#ff6900] transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/#pizza" className="hover:text-[#ff6900] transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/#pizza" className="hover:text-[#ff6900] transition-colors">
                  Danh mục ngành hàng
                </Link>
              </li>
              <li>
                <Link href="/#combo" className="hover:text-[#ff6900] transition-colors">
                  Chương trình khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================== */}
          {/* Column 3: HỖ TRỢ & CHÍNH SÁCH (2.5 cols)                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              HỖ TRỢ &amp; CHÍNH SÁCH
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-500 dark:text-zinc-400">
              <li>
                <Link href="#" className="hover:text-[#ff6900] transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#ff6900] transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#ff6900] transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#ff6900] transition-colors">
                  Đăng ký bán hàng cùng chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================== */}
          {/* Column 4: BẢN TIN KEIPIZZA (3.5 cols)                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              BẢN TIN KEIPIZZA
            </h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Đăng ký nhận thông tin ưu đãi và các sản phẩm nổi bật mới nhất từ chúng tôi.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn..."
                required
                className="flex-1 h-10 px-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-[#ff6900] focus:ring-1 focus:ring-[#ff6900] transition-all"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#cc5200] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {subscribed ? <Check className="w-4 h-4" /> : 'Đăng ký'}
              </button>
            </form>

            {/* Security Guarantee Badge */}
            <div className="flex items-start gap-2.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="font-bold text-gray-800 dark:text-zinc-200">Mua sắm an toàn 100%</span>
                <span className="text-gray-400 dark:text-zinc-500 mt-0.5">Thông tin bảo mật và mã hóa hoàn toàn</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Bottom Sub-bar: Copyright & Payment Badges               */}
        {/* ======================================================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-gray-400 dark:text-zinc-500">
          <div>
            <span>© {new Date().getFullYear()} KEIPIZZA FASTFOOD. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="uppercase text-[10px] font-bold tracking-wider text-gray-400 dark:text-zinc-600">
              THANH TOÁN:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black">
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                VISA
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                MASTER
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                MOMO
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                COD
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                VNPAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
