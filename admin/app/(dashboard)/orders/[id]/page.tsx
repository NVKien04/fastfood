import { OrderDetailModule } from '@/features/orders';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailModule params={params} />;
}
