"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { useWishlistStore, useProductStore } from '@/lib/store';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const products = useProductStore((state) => state.products);

  return (
    <div className="bg-white text-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-black/10 pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
            Wishlist <span className="text-lg font-bold bg-black text-white px-3 py-1 rounded-full">{items.length}</span>
          </h1>
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2">
            <Home size={14} /> Back to Home
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {items.map((item) => {
              const productInfo = products.find(p => p.id === item.id);
              const stock = productInfo ? productInfo.stock : 0;
              const category = productInfo ? productInfo.category : 'Wishlist';
              
              return (
                <ProductCard 
                  key={item.id} 
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={category}
                  stock={stock}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                <Heart size={48} />
              </div>
            </div>
            <p className="text-xl font-bold uppercase tracking-widest">Your wishlist is empty</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/shirts" className="inline-block bg-black text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all">
                Discover Products
              </Link>
              <Link href="/" className="inline-block border border-black/10 hover:border-black px-12 py-5 font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Home size={16} /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
