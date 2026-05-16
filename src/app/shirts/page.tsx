import { ProductGrid } from '@/components/shop/ProductGrid';

const shirts = [
  { id: 's1', name: 'Oxford White Dress Shirt', price: 89.00, image: '/dress/shirts/shirt_1.png', category: 'Shirts' },
  { id: 's2', name: 'Midnight Navy Linen', price: 95.00, image: '/dress/shirts/shirt_2.png', category: 'Shirts' },
  { id: 's3', name: 'Premium Black Cotton', price: 110.00, image: '/dress/shirts/shirt_3.png', category: 'Shirts' },
  { id: 's4', name: 'Classic Striped Professional', price: 85.00, image: '/dress/shirts/shirt_4.png', category: 'Shirts' },
  { id: 's5', name: 'Modern Slim Fit Grey', price: 92.00, image: '/dress/shirts/shirt_5.png', category: 'Shirts' },
  { id: 's6', name: 'Signature Executive Blue', price: 125.00, image: '/dress/shirts/shirt_6.png', category: 'Shirts' },
];

export default function ShirtsPage() {
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Shirts Collection" products={shirts} />
    </div>
  );
}
