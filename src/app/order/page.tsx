"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Home } from 'lucide-react';
import { useCartStore, useOrderStore, useProductStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const { products, updateProduct } = useProductStore();
  const hydrated = useHydrated();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Compute total dynamically to prevent 0 or hydration issues
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 12500 ? 0 : 50.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    // Generate random Order ID
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create the order object
    const newOrder = {
      id: orderId,
      items: [...items],
      total: total,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Processing',
    };

    // 1. Add order to the Admin dashboard store
    addOrder(newOrder);

    // 2. Decrement product stocks
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        updateProduct(item.id, { stock: newStock });
      }
    });

    // 3. Clear the cart and update UI
    clearCart();
    setOrderPlaced(true);
  };

  if (!hydrated) {
    return (
      <div className="bg-white min-h-screen py-24 flex items-center justify-center">
        <p className="text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <CheckCircle size={64} className="text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black">Thank You!</h1>
          <p className="text-lg text-neutral-600">Your order has been placed successfully. Admins will process it shortly.</p>
          <div className="flex flex-col gap-4 pt-4">
            <Link href="/" className="w-full bg-black text-white py-5 px-8 text-center font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
              <Home size={18} /> Back to Home
            </Link>
            <Link href="/shirts" className="w-full border border-black/10 py-4 px-8 text-center font-bold uppercase tracking-widest hover:border-black transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-black uppercase text-black">Your cart is empty</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-black text-white py-5 px-8 text-center font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
              <Home size={18} /> Back to Home
            </Link>
            <Link href="/shirts" className="border border-black/10 py-5 px-8 text-center font-black uppercase tracking-widest hover:border-black transition-all">
              Shop Shirts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-black/10 pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Order Summary</h1>
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2">
            <Home size={14} /> Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div className="border border-black/10 p-6 space-y-6">
            <h2 className="text-lg font-black uppercase tracking-widest border-b border-black/5 pb-3">Items in Order</h2>
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center border-b border-black/5 pb-4 last:border-none last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-neutral-100 flex-shrink-0 border border-black/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">Qty: {item.quantity} | Size: {item.size || 'N/A'}</p>
                  </div>
                </div>
                <p className="font-black text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="bg-neutral-50 border border-black/10 p-6 space-y-4">
            <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-neutral-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-neutral-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xl font-black pt-4 border-t border-black/10">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
          >
            Place Order <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
