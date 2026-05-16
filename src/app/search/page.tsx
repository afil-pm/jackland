"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/ProductGrid';

const allProducts = [
  { id: 's1', name: 'Oxford White Dress Shirt', price: 89.00, image: '/dress/shirts/shirt_1.png', category: 'Shirts' },
  { id: 's2', name: 'Midnight Navy Linen', price: 95.00, image: '/dress/shirts/shirt_2.png', category: 'Shirts' },
  { id: 'p1', name: 'Raw Indigo Denim', price: 145.00, image: '/dress/pants/jeans_1.png', category: 'Jeans' },
  { id: 'p5', name: 'Midnight Chino Pants', price: 110.00, image: '/dress/pants/pant_1.png', category: 'Pants' },
  // ... more products
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const results = allProducts.filter(p => 
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
