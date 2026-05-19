import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── CART ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id && i.size === item.size);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'jack-land-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        if (!currentItems.find((i) => i.id === item.id)) {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    {
      name: 'jack-land-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── PRODUCT STORE (Backend Synced) ──────────────────────────────────────────

export interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  stock: number;
}

const defaultProducts: Product[] = [
  { id: 's1', name: 'Solid Brown Formal Shirt', price: 999, image: '/dress/shirts/shirt_1.png', category: 'Shirts', description: 'A stylish solid brown shirt that brings a modern twist to professional attire.', stock: 10 },
  { id: 's2', name: 'Grey Double-Pocket Casual Shirt', price: 899, image: '/dress/shirts/shirt_2.png', category: 'Shirts', description: 'This comfortable grey/slate shirt features double chest pockets.', stock: 10 },
  { id: 's3', name: 'Classic Maroon Shirt', price: 899, image: '/dress/shirts/shirt_3.png', category: 'Shirts', description: 'A bold maroon shirt designed with premium cotton.', stock: 10 },
  { id: 's4', name: 'Dark Green Tailored Shirt', price: 1199, image: '/dress/shirts/shirt_4.png', category: 'Shirts', description: 'An elegant dark green shirt that adds a touch of sophistication.', stock: 10 },
  { id: 'p1', name: 'Dark Grey Textured Jeans', price: 699, image: '/dress/pants/jeans_1.png', category: 'Jeans', description: 'These textured dark grey/black jeans are perfect for the true denim enthusiast.', stock: 10 },
  { id: 'p2', name: 'Light Blue Cargo Jeans', price: 999, image: '/dress/pants/jeans_2.png', category: 'Jeans', description: 'Light blue cargo jeans with spacious side pockets.', stock: 10 },
  { id: 'p5', name: 'Formal Brown Trousers', price: 899, image: '/dress/pants/pant_1.png', category: 'Pants', description: 'Formal brown trousers crafted for the modern professional.', stock: 10 },
  { id: 'p6', name: 'Light Blue Tailored Trousers', price: 1399, image: '/dress/pants/pant_2.png', category: 'Pants', description: 'Elegant light blue formal trousers.', stock: 10 }
];

interface ProductStore {
  products: Product[];
  syncProducts: () => Promise<void>;
  updateProduct: (id: string, updates: FormData | Partial<Product>) => Promise<boolean>;
  addProduct: (product: FormData | Partial<Product>) => Promise<Product | null>;
  removeProduct: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      syncProducts: async () => {
        try {
          const res = await fetch(`${API_URL}/api/products`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              // Map DB _id to id for seamless integration with existing frontend logic
              const mapped = data.map((p: any) => ({
                ...p,
                id: p._id || p.id
              }));
              set({ products: mapped });
            }
          }
        } catch (e) {
          console.error('Failed to sync products from backend database:', e);
        }
      },
      addProduct: async (productData) => {
        const token = useAuthStore.getState().adminToken;
        try {
          const headers: Record<string, string> = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;

          let body;
          if (productData instanceof FormData) {
            body = productData;
          } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(productData);
          }

          const res = await fetch(`${API_URL}/api/admin/products`, {
            method: 'POST',
            headers,
            body,
          });

          if (res.ok) {
            const newProduct = await res.json();
            const mappedProduct = { ...newProduct, id: newProduct._id || newProduct.id };
            set({ products: [...get().products, mappedProduct] });
            return mappedProduct;
          }
          return null;
        } catch (e) {
          console.error('Failed to add product to backend:', e);
          return null;
        }
      },
      updateProduct: async (id, updates) => {
        const token = useAuthStore.getState().adminToken;
        try {
          const headers: Record<string, string> = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;

          let body;
          if (updates instanceof FormData) {
            body = updates;
          } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(updates);
          }

          const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
            method: 'PUT',
            headers,
            body,
          });

          if (res.ok) {
            const updated = await res.json();
            const mappedUpdated = { ...updated, id: updated._id || updated.id };
            set({
              products: get().products.map((p) => (p.id === id || p._id === id ? mappedUpdated : p)),
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Failed to update product on backend:', e);
          return false;
        }
      },
      removeProduct: async (id) => {
        const token = useAuthStore.getState().adminToken;
        try {
          const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          if (res.ok) {
            set({ products: get().products.filter((p) => p.id !== id && p._id !== id) });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Failed to delete product from backend:', e);
          return false;
        }
      },
    }),
    {
      name: 'jack-land-products-persistent',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── AUTH STORE ───────────────────────────────────────────────────────────────

interface User {
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAdminLoggedIn: false,
      adminToken: null,
      register: async (name, email, password) => {
        try {
          const res = await fetch(`${API_URL}/api/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          if (res.ok) {
            const data = await res.json();
            set({ user: { name: data.admin.name, email: data.admin.email } });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password }),
          });
          if (res.ok) {
            const data = await res.json();
            set({ user: { name: data.admin.name, email: data.admin.email } });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      adminLogin: async (username, password) => {
        try {
          const res = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          
          if (res.ok && data.success) {
            set({
              isAdminLoggedIn: true,
              adminToken: data.token,
              user: { name: data.admin.name, email: data.admin.email },
            });
            return { success: true };
          }
          return { success: false, error: data.error || data.message || 'Invalid credentials' };
        } catch (e) {
          console.error('Admin API login failed:', e);
          return { success: false, error: 'Cannot connect to backend server. Is it running?' };
        }
      },
      logout: () => set({ user: null }),
      adminLogout: () => set({ isAdminLoggedIn: false, adminToken: null, user: null }),
    }),
    {
      name: 'jack-land-auth-persistent',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── ORDER STORE ──────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  _id?: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  isConfirmed?: boolean;
  confirmedAt?: string;
}

interface OrderStore {
  orders: Order[];
  syncOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: string, additionalUpdates?: Partial<Order>) => Promise<void>;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      syncOrders: async () => {
        const token = useAuthStore.getState().adminToken;
        try {
          const res = await fetch(`${API_URL}/api/admin/orders`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const mapped = data.map((o: any) => ({
                ...o,
                id: o.id || o._id
              }));
              set({ orders: mapped });
            }
          }
        } catch (e) {
          console.error('Failed to sync orders from database:', e);
        }
      },
      addOrder: async (order) => {
        // Optimistic local add
        set({ orders: [order, ...get().orders] });
        try {
          const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: order.items,
              total: order.total,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone,
              shippingAddress: order.shippingAddress,
            }),
          });
          if (res.ok) {
            const saved = await res.json();
            const mapped = { ...saved, id: saved.id || saved._id };
            set({
              orders: get().orders.map((o) => (o.id === order.id ? mapped : o)),
            });
          }
        } catch (e) {
          console.error('Failed to save order to database:', e);
        }
      },
      updateOrderStatus: async (id, status, additionalUpdates = {}) => {
        const token = useAuthStore.getState().adminToken;
        // Optimistic local update
        set({
          orders: get().orders.map((o) =>
            o.id === id || o._id === id ? { ...o, status, ...additionalUpdates } : o
          ),
        });
        try {
          await fetch(`${API_URL}/api/admin/orders/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ status, additionalUpdates }),
          });
        } catch (e) {
          console.error('Failed to update order status in database:', e);
        }
      },
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'jack-land-orders-persistent',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
