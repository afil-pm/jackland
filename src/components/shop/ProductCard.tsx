"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Share2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/lib/store';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  
  const isLiked = wishlistItems.some(item => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, quantity: 1 });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-transparent hover:border-black/5 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link href={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1596755094514-f87034a26cc1?q=80&w=1974&auto=format&fit=crop" }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
          <span className="bg-black text-white text-[8px] md:text-[10px] font-black uppercase px-1.5 py-0.5 md:px-2 md:py-1 tracking-widest">
            New
          </span>
        </div>

        {/* Action Buttons (Hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
            >
              <button 
                className="flex-1 bg-black text-white py-2 md:py-3 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Add to Cart</span><span className="md:hidden">Add</span>
              </button>
              <button 
                className="bg-white text-black p-3 hover:bg-neutral-100 transition-colors border border-black/10"
                onClick={() => console.log('Quick view')}
              >
                <Eye size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Right Icons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleToggleWishlist}
            className={cn(
              "p-2 rounded-full shadow-sm transition-all duration-300",
              isLiked ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white border border-black/5"
            )}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="bg-white text-black p-2 rounded-full shadow-sm hover:bg-black hover:text-white transition-all duration-300">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="py-3 md:py-5 px-1">
        <p className="text-[8px] md:text-[10px] text-neutral-600 uppercase tracking-widest font-bold mb-1">{category}</p>
        <Link href={`/product/${id}`}>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-tight mb-1 md:mb-2 hover:underline line-clamp-1">{name}</h3>
        </Link>
        <p className="text-sm md:text-lg font-black">${price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
};
