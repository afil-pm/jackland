"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { useWishlistStore } from '@/lib/store';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="bg-white text-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
          Wishlist <span className="text-lg font-bold bg-black text-white px-3 py-1 rounded-full">{items.length}</span>
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {items.map((item) => (
              <ProductCard 
                key={item.id} 
                {...item} 
                category="Wishlist" 
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                <Heart size={48} />
              </div>
            </div>
            <p className="text-xl font-bold uppercase tracking-widest">Your wishlist is empty</p>
            <Link href="/shirts" className="inline-block bg-black text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all">
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
