"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Share2, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore, useProductStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const hydrated = useHydrated();

  const products = useProductStore((s) => s.products);
  const product = products.find((p) => p.id === id) || products[0];

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } =
    useWishlistStore();

  const isLiked = hydrated && wishlistItems.some((item) => item.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    });
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: product?.name || 'Jack Land Store',
          text: `Check out this amazing product on Jack Land: ${product?.name}`,
          url: url,
        }).catch(() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  if (!hydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="bg-white text-black min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="flex-1 space-y-4">
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 border border-black/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1596755094514-f87034a26cc1?q=80&w=1974&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-100 border border-black/5 cursor-pointer hover:border-black transition-colors"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-neutral-600 mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-black">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest border-l border-black/10 pl-4">
                  128 Reviews
                </span>
              </div>
              <p className="text-3xl font-black">₹{product.price.toFixed(2)}</p>
              {product.stock > 0 ? (
                <p className="text-xs text-green-600 font-bold mt-2 uppercase tracking-widest">
                  ✓ In Stock ({product.stock} left)
                </p>
              ) : (
                <p className="text-xs text-red-500 font-bold mt-2 uppercase tracking-widest">
                  Out of Stock
                </p>
              )}
            </div>

            <p className="text-neutral-600 leading-relaxed max-w-lg">{product.description}</p>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center max-w-sm">
                <span className="text-xs font-black uppercase tracking-widest">Select Size</span>
                <span className="text-xs underline cursor-pointer hover:text-neutral-500">Size Guide</span>
              </div>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all',
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/10 hover:border-black'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6 pt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center justify-between border border-black/10 h-14 sm:h-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-6 py-2 hover:bg-neutral-100 h-full flex items-center disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-6 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-6 py-2 hover:bg-neutral-100 h-full flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-4 flex-1">
                  <button
                    className={cn(
                      'flex-1 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors',
                      added
                        ? 'bg-green-600 text-white'
                        : 'bg-black text-white hover:bg-neutral-800'
                    )}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingBag size={20} /> {added ? 'Added!' : 'Add to Cart'}
                  </button>
                  <button
                    className={cn(
                      'p-4 border border-black/10 transition-colors flex items-center justify-center',
                      isLiked ? 'bg-black text-white' : 'hover:bg-neutral-100'
                    )}
                    onClick={handleToggleWishlist}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <button
                className="w-full py-4 border-2 border-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy It Now
              </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-black/10">
              <div className="flex items-start gap-4">
                <Truck size={20} className="mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Free Delivery</h4>
                  <p className="text-[10px] text-neutral-500 uppercase">On all orders over ₹12500</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RotateCcw size={20} className="mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Easy Returns</h4>
                  <p className="text-[10px] text-neutral-500 uppercase">30-day hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck size={20} className="mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Secure Checkout</h4>
                  <p className="text-[10px] text-neutral-500 uppercase">100% encrypted payments</p>
                </div>
              </div>
              <div 
                onClick={handleShare}
                className="flex items-start gap-4 cursor-pointer hover:text-neutral-500 transition-colors"
              >
                <Share2 size={20} className="mt-1" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Share Product</h4>
                  <p className={cn(
                    "text-[10px] uppercase transition-all",
                    copied ? "text-green-600 font-black animate-pulse" : "text-neutral-500"
                  )}>
                    {copied ? "✓ Copied to clipboard!" : "Send to a friend"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
