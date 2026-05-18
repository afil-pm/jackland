"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Home, Truck, ShieldCheck, Mail } from 'lucide-react';
import { useCartStore, useOrderStore, useProductStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

export default function OrderPage() {
  const { items, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const { products, updateProduct } = useProductStore();
  const hydrated = useHydrated();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  // Compute total dynamically to prevent 0 or hydration issues
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 12500 ? 0 : 50.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!name || !email || !phone || !address) {
      setFormError('Please fill in all shipping details to complete your order.');
      return;
    }

    setFormError('');

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
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      isConfirmed: false,
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

    // 3. Save order ID, clear the cart and update UI
    setCreatedOrderId(orderId);
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
        <div className="text-center space-y-6 max-w-md bg-white border border-black/5 p-8 sm:p-12 shadow-2xl rounded-2xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
              <CheckCircle size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black">Order Placed!</h1>
          <p className="text-sm text-neutral-500 uppercase tracking-widest font-black">
            Order ID: <span className="text-black bg-neutral-100 px-3 py-1 rounded select-all font-mono">{createdOrderId}</span>
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Thank you for shopping with Jack Land! Your order has been registered successfully. You can track your shipment status in real-time.
          </p>
          
          <div className="flex flex-col gap-3 pt-4">
            <Link 
              href={`/track-order?id=${createdOrderId}`}
              className="w-full bg-black text-white py-4 px-8 text-center font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
            >
              <Truck size={18} /> Track Your Order
            </Link>
            <Link 
              href="/" 
              className="w-full border border-black/10 py-4 px-8 text-center font-black uppercase tracking-widest hover:border-black transition-all flex items-center justify-center gap-2"
            >
              <Home size={16} /> Back to Home
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12 border-b border-black/10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">Secure Checkout</h1>
          <Link href="/" className="text-xs font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2">
            <Home size={14} /> Back to Home
          </Link>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-sm font-bold flex items-center gap-2">
            <span>⚠</span> {formError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border border-black/10 p-8 rounded-xl bg-white space-y-6">
              <h2 className="text-lg font-black uppercase tracking-widest border-b border-black/5 pb-3 flex items-center gap-2">
                <Truck size={18} /> Shipping & Delivery Information
              </h2>
              
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-black/15 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full border border-black/15 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full border border-black/15 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, Town/City, State, PIN Code"
                    className="w-full border border-black/15 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                  />
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg flex items-start gap-3 border border-black/5">
                  <ShieldCheck className="text-neutral-500 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    By placing your order, you agree to our terms of service. Cash on delivery and secure online banking payments will be facilitated upon order validation.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-5 rounded-lg font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 mt-4 shadow-lg hover:shadow-xl"
                >
                  Confirm & Place Order <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-black/10 p-8 rounded-xl bg-neutral-50 space-y-6 sticky top-24">
              <h2 className="text-lg font-black uppercase tracking-widest border-b border-black/5 pb-3">Order Summary</h2>
              
              <div className="divide-y divide-black/5 max-h-72 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white flex-shrink-0 border border-black/5 rounded overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-black uppercase text-xs line-clamp-1">{item.name}</h3>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Qty: {item.quantity} | Size: {item.size || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="font-black text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-black/10 space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-neutral-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-neutral-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black pt-4 border-t border-black/10 text-black">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
