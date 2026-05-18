"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/ProductGrid';

const allProducts = [
  { id: 's1', name: 'Solid Brown Formal Shirt', price: 7387, image: '/dress/shirts/shirt_1.png', category: 'Shirts' },
  { id: 's2', name: 'Grey Double-Pocket Casual Shirt', price: 7885, image: '/dress/shirts/shirt_2.png', category: 'Shirts' },
  { id: 's3', name: 'Classic Maroon Shirt', price: 9130, image: '/dress/shirts/shirt_3.png', category: 'Shirts' },
  { id: 's4', name: 'Dark Green Tailored Shirt', price: 7055, image: '/dress/shirts/shirt_4.png', category: 'Shirts' },
  { id: 's5', name: 'Vibrant Yellow Casual Shirt', price: 7636, image: '/dress/shirts/shirt_5.png', category: 'Shirts' },
  { id: 's6', name: 'Executive Dark Red Shirt', price: 10375, image: '/dress/shirts/shirt_6.png', category: 'Shirts' },
  { id: 'p1', name: 'Dark Grey Textured Jeans', price: 12035, image: '/dress/pants/jeans_1.png', category: 'Jeans' },
  { id: 'p2', name: 'Light Blue Cargo Jeans', price: 10790, image: '/dress/pants/jeans_2.png', category: 'Jeans' },
  { id: 'p3', name: 'Classic Blue Straight Jeans', price: 9960, image: '/dress/pants/jeans_3.png', category: 'Jeans' },
  { id: 'p4', name: 'Dark Blue Slim Fit Jeans', price: 11205, image: '/dress/pants/jeans_4.png', category: 'Jeans' },
  { id: 'p5', name: 'Formal Brown Trousers', price: 9130, image: '/dress/pants/pant_1.png', category: 'Pants' },
  { id: 'p6', name: 'Light Blue Tailored Trousers', price: 13280, image: '/dress/pants/pant_2.png', category: 'Pants' },
  { id: 'p7', name: 'Grey Pinstripe Formal Pants', price: 7885, image: '/dress/pants/pant_3.png', category: 'Pants' },
  { id: 'p8', name: 'Classic Khaki Trousers', price: 12450, image: '/dress/pants/pant_4.png', category: 'Pants' },
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
