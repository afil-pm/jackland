"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  FileText, 
  Phone, 
  MapPin, 
  User, 
  Clock 
} from 'lucide-react';
import { useOrderStore } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get('id') || '';
  const [inputId, setInputId] = useState(queryId);
  const { orders, syncOrders } = useOrderStore();
  const hydrated = useHydrated();

  // Sync orders from central database upon landing
  useEffect(() => {
    syncOrders();
  }, [syncOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      router.push(`/track-order?id=${inputId.trim().toUpperCase()}`);
    }
  };

  if (!hydrated) {
    return (
      <div className="bg-white min-h-screen py-24 flex items-center justify-center">
        <p className="text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Loading tracking details...</p>
      </div>
    );
  }

  // Find the requested order
  const order = orders.find(
    (o) => o.id.toUpperCase() === queryId.trim().toUpperCase()
  );

  // Status mapping to step numbers
  const getStatusStep = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'confirmed') return 2;
    return 1; // "processing" or "placed"
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  const steps = [
    { number: 1, label: 'Order Placed', desc: 'We have received your order request.', icon: FileText },
    { number: 2, label: 'Order Confirmed', desc: 'Confirmed by our Admin team.', icon: CheckCircle },
    { number: 3, label: 'Shipped Out', desc: 'Out for delivery with tracking.', icon: Truck },
    { number: 4, label: 'Delivered', desc: 'Package received by customer.', icon: Package },
  ];

  return (
    <div className="bg-white text-black min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-black/10 pb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">Track Order</h1>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mt-1">
              Real-time delivery status of your purchase
            </p>
          </div>
          <Link 
            href="/" 
            className="text-xs font-black uppercase tracking-widest hover:text-neutral-500 transition-colors flex items-center gap-2"
          >
            <Home size={14} /> Back to Home
          </Link>
        </div>

        {/* Search / Lookup Input */}
        <div className="bg-neutral-50 border border-black/5 p-6 rounded-xl mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-123456)"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="w-full bg-white border border-black/10 rounded-lg py-3.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all uppercase font-mono font-bold"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3.5 rounded-lg font-black uppercase tracking-widest hover:bg-neutral-800 transition-all text-xs flex items-center justify-center gap-2"
            >
              Track Order Status
            </button>
          </form>
        </div>

        {/* Results / Status Display */}
        {queryId ? (
          order ? (
            <div className="space-y-10">
              
              {/* Order Info Banner */}
              <div className="bg-black text-white p-8 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Order Reference</p>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{order.id}</h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-neutral-300">
                    <Clock size={12} /> Placed on {order.date}
                  </div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black">Current Status</p>
                  <p className="text-sm font-black uppercase tracking-wider text-green-400 mt-0.5">{order.status}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="border border-black/10 p-8 rounded-xl space-y-8 bg-white">
                <h3 className="text-sm font-black uppercase tracking-widest border-b border-black/5 pb-3">Delivery Timeline</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {steps.map((step) => {
                    const isCompleted = currentStep >= step.number;
                    const isActive = currentStep === step.number;
                    const Icon = step.icon;

                    return (
                      <div key={step.number} className="flex flex-row md:flex-col items-start gap-4 md:text-center md:items-center relative z-10">
                        {/* Step Circle */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${
                          isCompleted 
                            ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                        } ${isActive ? 'ring-4 ring-neutral-100 animate-pulse' : ''}`}>
                          <Icon size={20} />
                        </div>

                        {/* Text Details */}
                        <div className="space-y-1 md:text-center text-left">
                          <h4 className={`text-xs font-black uppercase tracking-wider ${isCompleted ? 'text-black' : 'text-neutral-400'}`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-neutral-500 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid: Delivery Info & Item Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Shipping Details */}
                <div className="md:col-span-5 border border-black/10 p-6 rounded-xl bg-white space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest border-b border-black/5 pb-3">Delivery Details</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <User className="text-neutral-400 mt-0.5" size={14} />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Recipient Name</p>
                        <p className="font-bold text-black">{order.customerName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="text-neutral-400 mt-0.5" size={14} />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Contact Number</p>
                        <p className="font-bold text-black">{order.customerPhone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="text-neutral-400 mt-0.5" size={14} />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Shipping Destination</p>
                        <p className="font-bold text-black leading-relaxed">{order.shippingAddress || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items and Summary */}
                <div className="md:col-span-7 border border-black/10 p-6 rounded-xl bg-neutral-50 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest border-b border-black/5 pb-3">Order Details</h3>
                  
                  <div className="divide-y divide-black/5 max-h-60 overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-white flex-shrink-0 rounded border border-black/5 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase line-clamp-1">{item.name}</h4>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                              Qty: {item.quantity} | Size: {item.size || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <p className="font-black text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                    <p className="text-xs uppercase tracking-widest font-black text-neutral-500">Total Charged</p>
                    <p className="text-lg font-black text-black">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-red-200 bg-red-50/50 rounded-xl space-y-4">
              <p className="text-red-700 font-bold uppercase tracking-widest text-sm">Order ID Not Found</p>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto">
                We couldn't locate any records matching <span className="font-mono font-bold text-black uppercase">"{queryId}"</span>. Please check the spelling and try again.
              </p>
            </div>
          )
        ) : (
          <div className="py-24 text-center border border-dashed border-black/10 rounded-xl space-y-4">
            <Clock className="mx-auto text-neutral-300" size={48} />
            <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Enter your order ID above to begin tracking</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
