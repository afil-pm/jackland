"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center py-24 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-black/10 p-10 md:p-16 shadow-2xl shadow-black/5"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest">
            Jack Land Jeans Exclusive Membership
          </p>
        </div>

        <form className="space-y-6">
          {!isLogin && (
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-neutral-50 border-none py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
                />
                <Mail className="absolute left-4 top-4 text-neutral-400" size={18} />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full bg-neutral-50 border-none py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <Mail className="absolute left-4 top-4 text-neutral-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
              {isLogin && (
                <Link href="#" className="text-[10px] uppercase font-bold text-neutral-400 hover:text-black transition-colors">Forgot Password?</Link>
              )}
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-neutral-50 border-none py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <Lock className="absolute left-4 top-4 text-neutral-400" size={18} />
            </div>
          </div>

          <button className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3">
            {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-black/10">
          <div className="text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-black/10 hover:border-black transition-all text-xs font-bold uppercase tracking-widest">
                <Mail size={18} /> Email
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border border-black/10 hover:border-black transition-all text-xs font-bold uppercase tracking-widest">
                Google
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-black font-black uppercase tracking-tighter hover:underline"
              >
                {isLogin ? 'Create One' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
