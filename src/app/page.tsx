"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop" 
            alt="Premium Men's Fashion" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none"
          >
            Redefining <br /> <span className="text-outline">Modern</span> Elegance
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto uppercase tracking-widest font-light"
          >
            Exclusive Men's Dress Collection for the Bold and Sophisticated.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shirts" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center group">
              Shop Shirts <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/pants" className="px-10 py-4 border-2 border-white text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Shop Pants
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Category Card 1 */}
            <Link href="/shirts" className="relative flex-1 group overflow-hidden h-[600px]">
              <img 
                src="/dress/shirts/shirt_1.png" 
                alt="Premium Shirts" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1596755094514-f87034a26cc1?q=80&w=1974&auto=format&fit=crop" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-4xl font-black uppercase mb-2">Premium Shirts</h2>
                <p className="text-neutral-300 uppercase tracking-widest text-sm flex items-center">Explore Collection <ArrowRight className="ml-2" size={16} /></p>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/pants" className="relative flex-1 group overflow-hidden h-[600px]">
              <img 
                src="/dress/pants/pant_1.png" 
                alt="Tailored Pants" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1624371414361-e6e8ea06255d?q=80&w=2070&auto=format&fit=crop" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-4xl font-black uppercase mb-2">Tailored Pants</h2>
                <p className="text-neutral-300 uppercase tracking-widest text-sm flex items-center">Explore Collection <ArrowRight className="ml-2" size={16} /></p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white text-black border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Why Choose Jack Land</h2>
            <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold">The Gold Standard in Men's Apparel</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div 
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-10 bg-neutral-50 border border-black/5 transition-all hover:border-black/20"
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-full mb-8 shadow-xl shadow-black/10">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Secure Payments</h3>
              <p className="text-neutral-600 leading-relaxed">
                Shop with absolute confidence. We use industry-leading SSL encryption and secure payment gateways to protect your data.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-10 bg-neutral-50 border border-black/5 transition-all hover:border-black/20"
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-full mb-8 shadow-xl shadow-black/10">
                <Truck size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Fast Delivery</h3>
              <p className="text-neutral-600 leading-relaxed">
                Global express shipping on all orders. Free delivery for premium members and orders over $150 with real-time tracking.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-10 bg-neutral-50 border border-black/5 transition-all hover:border-black/20"
            >
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-full mb-8 shadow-xl shadow-black/10">
                <Star size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Premium Quality</h3>
              <p className="text-neutral-600 leading-relaxed">
                Experience superior craftsmanship. Every garment is made from hand-picked fabrics and tailored to perfection.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
