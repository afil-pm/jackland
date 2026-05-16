import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white text-black w-10 h-10 flex items-center justify-center font-black text-xl transition-transform group-hover:rotate-12">
                JL
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">
                Jack <span className="text-neutral-400">land</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium men's fashion designed for the modern gentleman. Excellence in every stitch since 2024.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-neutral-400 transition-colors"><Mail size={20} /></Link>
              <Link href="#" className="hover:text-neutral-400 transition-colors"><Phone size={20} /></Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest">Shop</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/shirts" className="hover:text-white transition-colors">Shirts</Link></li>
              <li><Link href="/pants" className="hover:text-white transition-colors">Pants</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/featured" className="hover:text-white transition-colors">Featured</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest">Support</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-center"><Mail size={16} className="mr-3" /> support@jackland.com</li>
              <li className="flex items-center"><Phone size={16} className="mr-3" /> +1 (555) 000-0000</li>
              <li className="flex items-center"><MapPin size={16} className="mr-3" /> 123 Fashion Ave, NY</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Jack Land Jeans. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
