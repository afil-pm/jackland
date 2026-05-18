"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/ProductCard';
import { SlidersHorizontal, ChevronDown, Home, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [priceFilter, setPriceFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // 1. Filter products based on settings
  const filteredProducts = products.filter((product) => {
    // Price range filtering
    if (priceFilter === 'under-900' && product.price >= 900) return false;
    if (priceFilter === '900-1200' && (product.price < 900 || product.price > 1200)) return false;
    if (priceFilter === 'over-1200' && product.price <= 1200) return false;

    // Stock availability filtering
    if (stockFilter === 'in-stock' && product.stock === 0) return false;

    return true;
  });

  // 2. Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'in-stock') {
      return b.stock - a.stock;
    }
    // 'featured' returns initial list sorting
    return 0;
  });

  const clearAllFilters = () => {
    setPriceFilter('all');
    setStockFilter('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-black">
      {/* Header with Breadcrumb & Back to Home */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-black/10">
        <div>
          <nav className="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link> / <span className="text-black">Shop</span> / <span className="text-black font-bold">{title}</span>
          </nav>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* User friendly Back to Home Button */}
          <Link 
            href="/" 
            className="border border-black/10 hover:border-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 rounded bg-neutral-50 hover:bg-neutral-100"
          >
            <Home size={14} /> Back to Home
          </Link>
          
          {/* Toggle Filters Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 text-xs font-bold uppercase tracking-widest border px-5 py-2.5 transition-all rounded",
              showFilters 
                ? "bg-black text-white border-black hover:bg-neutral-800" 
                : "bg-white text-black border-black/10 hover:border-black"
            )}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-white border border-black/10 px-4 py-2.5 rounded hover:border-black transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mr-2">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer pr-5 appearance-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="in-stock">In Stock First</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-neutral-500" />
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-black/10 bg-neutral-50 p-6 mb-8 rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Filter Options */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Filter By Price</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-900', label: 'Under ₹900' },
                    { id: '900-1200', label: '₹900 - ₹1200' },
                    { id: 'over-1200', label: 'Over ₹1200' },
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setPriceFilter(range.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded transition-all",
                        priceFilter === range.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black/10 hover:border-black"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock/Availability Options */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Filter By Availability</h4>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'in-stock', label: 'In Stock Only' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStockFilter(option.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded transition-all",
                        stockFilter === option.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black/10 hover:border-black"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Controls */}
              <div className="flex items-end justify-start lg:justify-end">
                {(priceFilter !== 'all' || stockFilter !== 'all' || sortBy !== 'featured') && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-black uppercase tracking-widest border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-2 rounded"
                  >
                    <RefreshCw size={12} /> Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="py-24 text-center space-y-4 border border-dashed border-black/10 rounded-xl">
          <p className="text-neutral-500 uppercase tracking-widest font-bold">No products match your filters</p>
          <button 
            onClick={clearAllFilters}
            className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all rounded inline-block"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
