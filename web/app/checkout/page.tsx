import * as React from 'react';
import { CheckoutModule } from '@/modules/checkout/CheckoutModule';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-6">
      <CheckoutModule />
    </main>
  );
}
