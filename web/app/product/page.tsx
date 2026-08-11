import * as React from 'react';
import { ProductList } from '@/modules/product';

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ProductList />
    </main>
  );
}
