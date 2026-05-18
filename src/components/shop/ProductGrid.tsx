"use client";

import React, { useState } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface ProductGridProps {
  title: string;
  products: Product[];
}

export const ProductGrid = ({ title, products }: ProductGridProps) => {
  const [sortBy, setSortBy] = useState('featured');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <nav className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            <span className="hover:text-black cursor-pointer">Home</span> / <span className="text-black">Shop</span> / <span className="text-black font-bold">{title}</span>
          </nav>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{title}</h1>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1">
            <SlidersHorizontal size={16} /> Filter
          </button>
          <div className="relative group ml-auto md:ml-0">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1">
              Sort: {sortBy} <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-neutral-500 uppercase tracking-widest">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};
