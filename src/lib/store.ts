import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  total: number;
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
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => set({
        items: get().items.map((i) => i.id === id ? { ...i, quantity } : i),
      }),
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }
    }),
    { name: 'jack-land-cart' }
  )
);

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
    { name: 'jack-land-wishlist' }
  )
);
