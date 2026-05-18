import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

// ─── PRODUCT STORE (Admin-editable) ──────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

const defaultProducts: Product[] = [
  { id: 's1', name: 'Solid Brown Formal Shirt', price: 999, image: '/dress/shirts/shirt_1.png', category: 'Shirts', description: 'A stylish solid brown shirt that brings a modern twist to professional attire. Crafted for a crisp look and breathable comfort that lasts all day.', stock: 10 },
  { id: 's2', name: 'Grey Double-Pocket Casual Shirt', price: 899, image: '/dress/shirts/shirt_2.png', category: 'Shirts', description: 'This comfortable grey/slate shirt features double chest pockets, offering a casual yet refined look perfect for both work and weekends.', stock: 10 },
  { id: 's3', name: 'Classic Maroon Shirt', price: 899, image: '/dress/shirts/shirt_3.png', category: 'Shirts', description: 'A bold maroon shirt designed with premium cotton for a smooth finish and a perfect fit that enhances your silhouette.', stock: 10 },
  { id: 's4', name: 'Dark Green Tailored Shirt', price: 1199, image: '/dress/shirts/shirt_4.png', category: 'Shirts', description: 'An elegant dark green shirt that adds a touch of sophistication to your wardrobe, combining classic tailoring with a modern shade.', stock: 10 },
  { id: 's5', name: 'Vibrant Yellow Casual Shirt', price: 799, image: '/dress/shirts/shirt_5.png', category: 'Shirts', description: 'Stand out in this bright yellow shirt. Its vibrant color and comfortable fit make it an ideal choice for a confident, energetic look.', stock: 10 },
  { id: 's6', name: 'Executive Dark Red Shirt', price: 1299, image: '/dress/shirts/shirt_6.png', category: 'Shirts', description: 'A luxurious dark red/maroon shirt with a subtle sheen, offering a truly executive feel for important occasions and evening wear.', stock: 10 },
  { id: 'p1', name: 'Dark Grey Textured Jeans', price: 699, image: '/dress/pants/jeans_1.png', category: 'Jeans', description: 'These textured dark grey/black jeans are perfect for the true denim enthusiast. Featuring sturdy construction that develops a unique character over time.', stock: 10 },
  { id: 'p2', name: 'Light Blue Cargo Jeans', price: 999, image: '/dress/pants/jeans_2.png', category: 'Jeans', description: 'Light blue loose-fit cargo jeans with spacious side pockets. They offer ultimate comfort and utility with a trendy streetwear aesthetic.', stock: 10 },
  { id: 'p3', name: 'Classic Blue Straight Jeans', price: 1499, image: '/dress/pants/jeans_3.png', category: 'Jeans', description: 'Classic blue denim jeans with a timeless straight leg cut. Essential for any wardrobe, providing versatility and durability.', stock: 10 },
  { id: 'p4', name: 'Dark Blue Slim Fit Jeans', price: 999, image: '/dress/pants/jeans_4.png', category: 'Jeans', description: 'Dark blue slim fit jeans that offer a sleek and urban look. Engineered with a slight stretch for maximum mobility.', stock: 10 },
  { id: 'p5', name: 'Formal Brown Trousers', price: 899, image: '/dress/pants/pant_1.png', category: 'Pants', description: 'Formal brown trousers crafted for the modern professional. These pants deliver a sharp, tailored appearance suitable for any office setting.', stock: 10 },
  { id: 'p6', name: 'Light Blue Tailored Trousers', price: 1399, image: '/dress/pants/pant_2.png', category: 'Pants', description: 'Elegant light blue formal trousers. Their premium fabric and impeccable tailoring ensure you look your best at formal events.', stock: 10 },
  { id: 'p7', name: 'Grey Pinstripe Formal Pants', price: 749, image: '/dress/pants/pant_3.png', category: 'Pants', description: 'Sophisticated grey trousers with a subtle pinstripe pattern. A classic choice that adds authority to your business attire.', stock: 10 },
  { id: 'p8', name: 'Classic Khaki Trousers', price: 1399, image: '/dress/pants/pant_4.png', category: 'Pants', description: 'Classic khaki/beige formal trousers offering a comfortable fit and a versatile neutral color that pairs perfectly with any shirt.', stock: 10 },
];

interface ProductStore {
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      updateProduct: (id, updates) =>
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }),
      addProduct: (product) => set({ products: [...get().products, product] }),
      removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
    }),
    {
      name: 'jack-land-products',
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
  register: (name: string, email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  adminLogout: () => void;
}

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1010_Admin@JackLand.com';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAdminLoggedIn: false,
      register: (name, email, password) => {
        try {
          const users: { name: string; email: string; password: string }[] = JSON.parse(
            localStorage.getItem('jack-land-users') || '[]'
          );
          if (users.find((u) => u.email === email)) return false; // email taken
          users.push({ name, email, password });
          localStorage.setItem('jack-land-users', JSON.stringify(users));
          set({ user: { name, email } });
          return true;
        } catch {
          return false;
        }
      },
      login: (email, password) => {
        try {
          const users: { name: string; email: string; password: string }[] = JSON.parse(
            localStorage.getItem('jack-land-users') || '[]'
          );
          const match = users.find((u) => u.email === email && u.password === password);
          if (match) {
            set({ user: { name: match.name, email: match.email } });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      adminLogin: (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          set({ isAdminLoggedIn: true, user: { name: username, email: '' } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      adminLogout: () => set({ isAdminLoggedIn: false }),
    }),
    {
      name: 'jack-land-auth',
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
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'jack-land-orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
