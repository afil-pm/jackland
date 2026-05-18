"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Pencil,
  Trash2,
  Check,
  X,
  Lock,
  AlertCircle,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useProductStore, Product, useOrderStore, Order } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

// ─── Admin Login Gate ──────────────────────────────────────────────────────────
function AdminLoginGate({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const { adminLogin } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(username, pw);
    if (ok) {
      onLogin();
    } else {
      setErr('Incorrect admin username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white p-10 max-w-sm w-full shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Admin Access</h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">Jack Land — Restricted</p>
        </div>
        {err && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-xs font-bold">
            <AlertCircle size={14} /> {err}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-black/20 py-4 px-4 text-sm focus:ring-1 focus:ring-black outline-none"
          />
          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border border-black/20 py-4 px-4 text-sm focus:ring-1 focus:ring-black outline-none"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
          >
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Editable product row ─────────────────────────────────────────────────────
function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const { updateProduct, removeProduct } = useProductStore();

  const save = () => {
    updateProduct(product.id, {
      name,
      price: parseFloat(price) || product.price,
      stock: parseInt(stock) || product.stock,
    });
    setEditing(false);
  };

  const cancel = () => {
    setName(product.name);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setEditing(false);
  };

  return (
    <div className="bg-white p-5 border border-black/5 rounded-xl flex flex-col md:flex-row md:items-center gap-4 hover:border-black/20 transition-all">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
          <img src={product.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black/20 px-2 py-1 text-xs font-black uppercase tracking-tight focus:ring-1 focus:ring-black outline-none"
            />
          ) : (
            <h4 className="text-sm font-black uppercase tracking-tight truncate">{product.name}</h4>
          )}
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">
            {product.category}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black mb-1">Price (₹)</p>
          {editing ? (
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-24 border border-black/20 px-2 py-1 text-sm font-black text-center focus:ring-1 focus:ring-black outline-none"
            />
          ) : (
            <p className="text-sm font-black">₹{product.price}</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black mb-1">Stock</p>
          {editing ? (
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-16 border border-black/20 px-2 py-1 text-sm font-black text-center focus:ring-1 focus:ring-black outline-none"
            />
          ) : (
            <p className={cn('text-sm font-black', product.stock === 0 ? 'text-red-500' : 'text-black')}>
              {product.stock}
            </p>
          )}
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={save}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={cancel}
              className="p-2 bg-neutral-200 text-black rounded hover:bg-neutral-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => removeProduct(product.id)}
              className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────
function AddProductModal({ onClose }: { onClose: () => void }) {
  const { addProduct, products } = useProductStore();
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Shirts',
    image: '',
    description: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const newId = `custom-${Date.now()}`;
    addProduct({
      id: newId,
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      category: form.category,
      image: form.image || '/dress/shirts/shirt_1.png',
      description: form.description,
    });
    onClose();
  };

  const inputCls =
    'w-full border border-black/20 px-3 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">Add New Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
                Product Name *
              </label>
              <input
                required
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Blue Slim Shirt"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
                Category
              </label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Shirts</option>
                <option>Jeans</option>
                <option>Pants</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
                Price (₹) *
              </label>
              <input
                required
                type="number"
                className={inputCls}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1499"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
                Stock
              </label>
              <input
                type="number"
                className={inputCls}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
              Image Path (e.g. /dress/shirts/shirt_1.png)
            </label>
            <input
              className={inputCls}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/dress/shirts/shirt_1.png"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              className={inputCls}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product description..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { isAdminLoggedIn, adminLogout } = useAuthStore();
  const { products } = useProductStore();
  const { orders, updateOrderStatus, clearOrders } = useOrderStore();
  const hydrated = useHydrated();

  const handleSendConfirmation = (order: Order) => {
    updateOrderStatus(order.id, 'Confirmed', { 
      isConfirmed: true, 
      confirmedAt: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) 
    });
    setToastMessage(`✓ Confirmation dispatch simulated! Email sent to ${order.customerName}`);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!hydrated) return null;
  if (!isAdminLoggedIn) return <AdminLoginGate onLogin={() => {}} />;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((a, p) => a + p.stock, 0);
  const totalValue = products.reduce((a, p) => a + p.price * p.stock, 0);
  const totalSales = orders.reduce((a, o) => a + o.total, 0);

  return (
    <>
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
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
                  'w-full flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all',
                  activeTab === item.id
                    ? 'bg-white text-black rounded-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
          <div className="p-8 border-t border-white/10">
            <button
              onClick={adminLogout}
              className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-20 bg-white border-b border-black/5 flex items-center justify-between px-10">
            <h1 className="text-2xl font-black uppercase tracking-tight capitalize">{activeTab}</h1>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-neutral-50 border-none rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-black outline-none w-64"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                AD
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-10">
            {/* ── Dashboard ──────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, trend: '', icon: TrendingUp },
                    { label: 'Active Orders', value: orders.length, trend: '', icon: ShoppingCart },
                    { label: 'Total Products', value: products.length, trend: '', icon: Package },
                    { label: 'Out of Stock', value: products.filter((p) => p.stock === 0).length, trend: '', icon: AlertCircle },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-black/5 rounded-xl space-y-4 shadow-sm">
                      <div className="flex justify-between items-center text-neutral-400">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                          {stat.label}
                        </p>
                        <h3 className="text-2xl font-black">{stat.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Products ───────────────────────────────────────────── */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-widest text-sm">
                    Products ({filteredProducts.length})
                  </h3>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-neutral-400 font-bold uppercase tracking-widest">
                      No products found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Orders ─────────────────────────────────────────────── */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-widest text-sm">
                    Customer Orders ({orders.length})
                  </h3>
                  {orders.length > 0 && (
                    <button
                      onClick={clearOrders}
                      className="bg-red-500 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                    >
                      Clear Order History
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-black/10 p-6 rounded-xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-black/5 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black uppercase text-base">{order.id}</span>
                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-1">
                            Placed on {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mb-0.5">
                            Total Paid
                          </p>
                          <p className="text-lg font-black text-black">₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={`${item.id}-${item.size}`} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-12 bg-neutral-100 rounded overflow-hidden flex-shrink-0 border border-black/5">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase line-clamp-1">{item.name}</h4>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                                  Qty: {item.quantity} | Size: {item.size || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs font-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {order.customerName && (
                        <div className="bg-neutral-50 p-4 rounded-lg border border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Customer Profile</p>
                            <p className="font-bold text-black">{order.customerName}</p>
                            <p className="text-neutral-500">{order.customerEmail} | {order.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Shipping Destination</p>
                            <p className="text-neutral-600 font-bold leading-relaxed">{order.shippingAddress}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 items-center justify-between border-t border-black/5 pt-4 mt-4">
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-neutral-50 border border-black/10 rounded px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/track-order?id=${order.id}`}
                            target="_blank"
                            className="text-[9px] bg-neutral-100 hover:bg-neutral-200 transition-colors text-black font-black uppercase tracking-widest px-4 py-2 border border-black/5 flex items-center gap-1.5"
                          >
                            Track Link ↗
                          </Link>

                          <button
                            onClick={() => handleSendConfirmation(order)}
                            className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 flex items-center gap-1.5 transition-all ${
                              order.isConfirmed
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-black text-white hover:bg-neutral-800'
                            }`}
                          >
                            <Mail size={12} /> {order.isConfirmed ? '✓ Confirmation Sent' : 'Send Order Confirmation'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-16 text-neutral-400 font-bold uppercase tracking-widest border border-dashed border-black/10 rounded-xl">
                      No orders placed yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Customers & Settings placeholder ─────────────────────── */}
            {(activeTab === 'customers' || activeTab === 'settings') && (
              <div className="flex items-center justify-center h-64 text-neutral-400 font-black uppercase tracking-widest">
                {activeTab} — Coming Soon
              </div>
            )}
          </main>
        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-4 shadow-2xl border border-white/10 z-50 animate-bounce flex items-center gap-3">
          <Mail size={16} className="text-green-400" /> {toastMessage}
        </div>
      )}
    </>
  );
};

export default AdminPanel;
