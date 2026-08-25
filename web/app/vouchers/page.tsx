import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { VoucherWallet } from '@/features/vouchers';

export const metadata: Metadata = {
  title: 'Ví Voucher & Mã Giảm Giá | FastFood',
  description: 'Kho mã giảm giá độc quyền và ưu đãi siêu hời tại FastFood.',
};

export default function VouchersPage() {
  return (
    <MainLayout>
      <div className="py-4 sm:py-6">
        <VoucherWallet />
      </div>
    </MainLayout>
  );
}
