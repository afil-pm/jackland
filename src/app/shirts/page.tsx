import { ProductGrid } from '@/components/shop/ProductGrid';

const shirts = [
  { id: 's1', name: 'Solid Brown Formal Shirt', price: 1739, image: '/dress/shirts/shirt_1.png', category: 'Shirts' },
  { id: 's2', name: 'Grey Double-Pocket Casual Shirt', price: 1789, image: '/dress/shirts/shirt_2.png', category: 'Shirts' },
  { id: 's3', name: 'Classic Maroon Shirt', price: 1919, image: '/dress/shirts/shirt_3.png', category: 'Shirts' },
  { id: 's4', name: 'Dark Green Tailored Shirt', price: 1699, image: '/dress/shirts/shirt_4.png', category: 'Shirts' },
  { id: 's5', name: 'Vibrant Yellow Casual Shirt', price: 1999, image: '/dress/shirts/shirt_5.png', category: 'Shirts' },
  { id: 's6', name: 'Executive Dark Red Shirt', price: 1599, image: '/dress/shirts/shirt_6.png', category: 'Shirts' },
];

export default function ShirtsPage() {
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Shirts Collection" products={shirts} />
    </div>
  );
}
