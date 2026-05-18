"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { useProductStore } from '@/lib/store';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const products = useProductStore((state) => state.products);
  
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title={`Search Results for "${query}"`} products={results} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
