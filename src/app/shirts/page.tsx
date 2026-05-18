"use client";

import { ProductGrid } from '@/components/shop/ProductGrid';
import { useProductStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export default function ShirtsPage() {
  const hydrated = useHydrated();
  const products = useProductStore((state) => state.products);
  const shirts = products.filter((p) => p.category === 'Shirts');

  if (!hydrated) {
    return <div className="bg-white min-h-screen" />;
  }

  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Shirts Collection" products={shirts} />
    </div>
  );
}
