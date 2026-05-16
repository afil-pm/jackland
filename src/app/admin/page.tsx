"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Plus, 
  Search,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-black text-white flex flex-col h-full">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Jack Land <span className="bg-white text-black px-1 ml-1">Admin</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-white text-black rounded-lg" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/10">
          <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10">
          <h1 className="text-2xl font-black uppercase tracking-tight capitalize">{activeTab}</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-neutral-50 border-none rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-black outline-none w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Total Revenue', value: '$124,592.00', trend: '+12.5%', icon: TrendingUp },
                  { label: 'Total Orders', value: '1,284', trend: '+8.2%', icon: ShoppingCart },
                  { label: 'Active Customers', value: '842', trend: '+5.4%', icon: Users },
                  { label: 'Pending Shipments', value: '24', trend: '-2.1%', icon: Package },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 border border-black/5 rounded-xl space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-neutral-400">
                      <stat.icon size={20} />
                      <span className={cn("text-[10px] font-bold", stat.trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
                        {stat.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-black">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-black/5 flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-widest text-sm">Recent Orders</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      <th className="px-8 py-4">Order ID</th>
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Product</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {[
                      { id: '#JL-1024', customer: 'Alex Rivera', product: 'Oxford Dress Shirt', status: 'Delivered', amount: '$89.00' },
                      { id: '#JL-1025', customer: 'Jordan Smith', product: 'Raw Indigo Denim', status: 'Processing', amount: '$145.00' },
                      { id: '#JL-1026', customer: 'Marcus Lee', product: 'Midnight Navy Linen', status: 'Shipped', amount: '$95.00' },
                      { id: '#JL-1027', customer: 'Sarah Chen', product: 'Slim Black Jeans', status: 'Delivered', amount: '$130.00' },
                    ].map((order, i) => (
                      <tr key={i} className="text-sm hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-5 font-bold">{order.id}</td>
                        <td className="px-8 py-5 text-neutral-500">{order.customer}</td>
                        <td className="px-8 py-5">{order.product}</td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            order.status === 'Delivered' ? "bg-green-100 text-green-700" :
                            order.status === 'Processing' ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-widest text-sm">Inventory Management</h3>
                  <button className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: 'Oxford White Dress Shirt', stock: 48, price: '$89.00', sales: 124 },
                    { name: 'Raw Indigo Denim', stock: 12, price: '$145.00', sales: 86 },
                    { name: 'Midnight Navy Linen', stock: 0, price: '$95.00', sales: 52 },
                  ].map((product, i) => (
                    <div key={i} className="bg-white p-6 border border-black/5 rounded-xl flex items-center justify-between hover:border-black/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                          <img src="/dress/shirts/shirt_1.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight">{product.name}</h4>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Category: Shirts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-16 text-center">
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mb-1">Price</p>
                          <p className="text-sm font-black">{product.price}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mb-1">Stock</p>
                          <p className={cn("text-sm font-black", product.stock === 0 ? "text-red-500" : "text-black")}>{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mb-1">Total Sales</p>
                          <p className="text-sm font-black">{product.sales}</p>
                        </div>
                        <button className="p-2 hover:bg-neutral-100 rounded-full">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
