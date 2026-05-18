import { ProductGrid } from '@/components/shop/ProductGrid';

const pants = [
  { id: 'p1', name: 'Dark Grey Textured Jeans', price: 1199, image: '/dress/pants/jeans_1.png', category: 'Jeans' },
  { id: 'p2', name: 'Light Blue Cargo Jeans', price: 1299, image: '/dress/pants/jeans_2.png', category: 'Jeans' },
  { id: 'p3', name: 'Classic Blue Straight Jeans', price: 799, image: '/dress/pants/jeans_3.png', category: 'Jeans' },
  { id: 'p4', name: 'Dark Blue Slim Fit Jeans', price: 999, image: '/dress/pants/jeans_4.png', category: 'Jeans' },
  { id: 'p5', name: 'Formal Brown Trousers', price: 899, image: '/dress/pants/pant_1.png', category: 'Pants' },
  { id: 'p6', name: 'Light Blue Tailored Trousers', price: 1359, image: '/dress/pants/pant_2.png', category: 'Pants' },
  { id: 'p7', name: 'Grey Pinstripe Formal Pants', price: 7789, image: '/dress/pants/pant_3.png', category: 'Pants' },
  { id: 'p8', name: 'Classic Khaki Trousers', price: 1459, image: '/dress/pants/pant_4.png', category: 'Pants' },
];

export default function PantsPage() {
  return (
    <div className="bg-white min-h-screen">
      <ProductGrid title="Pants & Jeans" products={pants} />
    </div>
  );
}
