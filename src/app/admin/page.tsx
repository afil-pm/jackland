"use client";

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useProductStore, Product } from '@/lib/store';
import { useHydrated } from '@/lib/useHydrated';

// ─── Admin Login Gate ──────────────────────────────────────────────────────────
function AdminLoginGate({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const { adminLogin } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(pw);
    if (ok) {
      onLogin();
    } else {
      setErr('Incorrect admin password.');
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
  const { isAdminLoggedIn, adminLogout } = useAuthStore();
  const { products } = useProductStore();
  const hydrated = useHydrated();

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
                    { label: 'Total Products', value: products.length, trend: '', icon: Package },
                    { label: 'Total Stock', value: totalStock, trend: '', icon: TrendingUp },
                    { label: 'Inventory Value', value: `₹${totalValue.toLocaleString()}`, trend: '', icon: ShoppingCart },
                    { label: 'Out of Stock', value: products.filter((p) => p.stock === 0).length, trend: '', icon: Users },
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

            {/* ── Other tabs placeholder ─────────────────────────────── */}
            {(activeTab === 'orders' || activeTab === 'customers' || activeTab === 'settings') && (
              <div className="flex items-center justify-center h-64 text-neutral-400 font-black uppercase tracking-widest">
                {activeTab} — Coming Soon
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
