"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/lib/store';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white text-black border-b border-black/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl transition-transform group-hover:rotate-12">
                JL
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Jack <span className="text-neutral-500">land</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input
                type="text"
                placeholder="Search for premium shirts, pants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border-none rounded-none py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-black transition-all outline-none text-black placeholder:text-neutral-500"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 bg-black text-white hover:bg-neutral-800 transition-colors">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Nav Links & Icons */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-bold uppercase tracking-widest">
            <Link href="/shirts" className="hover:text-neutral-500 transition-colors">Shirts</Link>
            <Link href="/pants" className="hover:text-neutral-500 transition-colors">Pants</Link>
            <div className="flex items-center space-x-4 ml-6 border-l border-black/10 pl-6">
              <Link href="/wishlist" className="relative group">
                <Heart size={22} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link href="/cart" className="relative group">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              </Link>
              <Link href="/account">
                <User size={22} className="hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-black">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-neutral-100 border-none py-3 px-4 focus:ring-1 focus:ring-black outline-none text-black placeholder:text-neutral-500"
              />
              <Search className="absolute right-3 top-3 text-neutral-400" size={20} />
            </div>
            <Link href="/shirts" className="block text-lg font-black uppercase py-2">Shirts</Link>
            <Link href="/pants" className="block text-lg font-black uppercase py-2">Pants</Link>
            <div className="flex space-x-6 pt-4 border-t border-black/10">
              <Link href="/wishlist" className="flex items-center"><Heart className="mr-2" /> Wishlist</Link>
              <Link href="/cart" className="flex items-center"><ShoppingCart className="mr-2" /> Cart</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
