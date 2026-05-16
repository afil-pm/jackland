"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const total = subtotal + shipping;

  return (
    <div className="bg-white text-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
          Your Bag <span className="text-lg font-bold bg-black text-white px-3 py-1 rounded-full">{items.length}</span>
        </h1>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Items List */}
            <div className="flex-[2] space-y-8">
              <div className="hidden md:grid grid-cols-6 gap-4 border-b border-black/10 pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                <div className="col-span-3">Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Total</div>
                <div className="text-right">Action</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center border-b border-black/5 pb-8">
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-3 flex gap-6">
                    <div className="w-24 h-32 bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm font-black uppercase tracking-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Size: {item.size}</p>
                      <p className="text-sm font-black">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center border border-black/10">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-neutral-100"><Minus size={14} /></button>
                      <span className="px-4 font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-neutral-100"><Plus size={14} /></button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-center font-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex-1">
              <div className="bg-neutral-50 p-8 border border-black/5 space-y-8 sticky top-32">
                <h2 className="text-xl font-black uppercase tracking-widest border-b border-black/10 pb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold pt-4 border-t border-black/10">
                    <span className="text-lg font-black">Total</span>
                    <span className="text-lg font-black">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
                    Checkout Now <ArrowRight size={20} />
                  </button>
                  <Link href="/shirts" className="block w-full text-center text-xs font-black uppercase tracking-widest py-4 border border-black/10 hover:border-black transition-all">
                    Continue Shopping
                  </Link>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    <ShieldCheck size={16} /> Secure Checkout Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                <ShoppingBag size={48} />
              </div>
            </div>
            <p className="text-xl font-bold uppercase tracking-widest">Your bag is empty</p>
            <Link href="/shirts" className="inline-block bg-black text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
