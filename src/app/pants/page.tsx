"use client";

import { ProductGrid } from '@/components/shop/ProductGrid';
import { useProductStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export default function PantsPage() {
  const hydrated = useHydrated();
  const products = useProductStore((state) => state.products);
  const pants = products.filter((p) => p.category === 'Pants' || p.category === 'Jeans');

  if (!hydrated) {
    return <div className="bg-white min-h-screen" />;
  }

  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Pants & Jeans" products={pants} />
    </div>
  );
}
