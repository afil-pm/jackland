import { ProductGrid } from '@/components/shop/ProductGrid';

const pants = [
  { id: 'p1', name: 'Raw Indigo Denim', price: 145.00, image: '/dress/pants/jeans_1.png', category: 'Jeans' },
  { id: 'p2', name: 'Slim Black Stretch Jeans', price: 130.00, image: '/dress/pants/jeans_2.png', category: 'Jeans' },
  { id: 'p3', name: 'Vintage Wash Straight Leg', price: 120.00, image: '/dress/pants/jeans_3.png', category: 'Jeans' },
  { id: 'p4', name: 'Urban Grey Tapered Jeans', price: 135.00, image: '/dress/pants/jeans_4.png', category: 'Jeans' },
  { id: 'p5', name: 'Midnight Chino Pants', price: 110.00, image: '/dress/pants/pant_1.png', category: 'Pants' },
  { id: 'p6', name: 'Tailored Slate Trousers', price: 160.00, image: '/dress/pants/pant_2.png', category: 'Pants' },
  { id: 'p7', name: 'Premium Khaki Classics', price: 95.00, image: '/dress/pants/pant_3.png', category: 'Pants' },
  { id: 'p8', name: 'Modern Charcoal Dress Pants', price: 150.00, image: '/dress/pants/pant_4.png', category: 'Pants' },
];

export default function PantsPage() {
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Pants & Jeans" products={pants} />
    </div>
  );
}
