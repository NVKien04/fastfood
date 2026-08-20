import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { CheckoutModule } from '@/features/checkout';

export const metadata: Metadata = {
  title: 'Thanh Toán Đơn Hàng | Pizza Hut',
  description: 'Xác nhận thông tin giao hàng và thanh toán đơn hàng nhanh chóng.',
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="py-6">
        <CheckoutModule />
      </div>
    </MainLayout>
  );
}
