import { ProductEditModule } from '@/features/products';

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductEditModule params={params} />;
}
