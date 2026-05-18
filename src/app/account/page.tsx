"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, login, register, logout } = useAuthStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isLogin) {
      const ok = login(email, password);
      if (ok) {
        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      const ok = register(name, email, password);
      if (ok) {
        setSuccess('Account created! Welcome to Jack Land.');
        setTimeout(() => router.push('/'), 1000);
      } else {
        setError('An account with this email already exists.');
      }
    }
  };

  if (user) {
    return (
      <div className="bg-white min-h-[80vh] flex items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-black/10 p-10 md:p-16 shadow-2xl shadow-black/5 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
              Welcome Back
            </h1>
            <p className="text-neutral-500 font-bold">{user.name}</p>
            <p className="text-xs text-neutral-400">{user.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="py-3 border border-black/10 hover:border-black transition-all text-xs font-bold uppercase tracking-widest text-center"
            >
              My Orders
            </Link>
            <Link
              href="/wishlist"
              className="py-3 border border-black/10 hover:border-black transition-all text-xs font-bold uppercase tracking-widest text-center"
            >
              Wishlist
            </Link>
          </div>
          <button
            onClick={logout}
            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-bold rounded">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs font-bold rounded">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-black/10 py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
                />
                <User className="absolute left-4 top-4 text-neutral-400" size={18} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-black/10 py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <Mail className="absolute left-4 top-4 text-neutral-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-black/10 py-4 px-4 pl-12 focus:ring-1 focus:ring-black outline-none transition-all"
              />
              <Lock className="absolute left-4 top-4 text-neutral-400" size={18} />
            </div>
            {!isLogin && (
              <p className="text-[10px] text-neutral-400">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-5 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
          >
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-black/10 text-center">
          <p className="text-xs text-neutral-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-black font-black uppercase tracking-tighter hover:underline"
            >
              {isLogin ? 'Create One' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
