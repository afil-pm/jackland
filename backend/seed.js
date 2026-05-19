import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Product from './models/Product.js';

dotenv.config();

const defaultProducts = [
  { name: 'Solid Brown Formal Shirt', price: 999, images: ['/dress/shirts/shirt_1.png'], category: 'Shirts', description: 'A stylish solid brown shirt that brings a modern twist to professional attire. Crafted for a crisp look and breathable comfort that lasts all day.', stock: 10 },
  { name: 'Grey Double-Pocket Casual Shirt', price: 899, images: ['/dress/shirts/shirt_2.png'], category: 'Shirts', description: 'This comfortable grey/slate shirt features double chest pockets, offering a casual yet refined look perfect for both work and weekends.', stock: 10 },
  { name: 'Classic Maroon Shirt', price: 899, images: ['/dress/shirts/shirt_3.png'], category: 'Shirts', description: 'A bold maroon shirt designed with premium cotton for a smooth finish and a perfect fit that enhances your silhouette.', stock: 10 },
  { name: 'Dark Green Tailored Shirt', price: 1199, images: ['/dress/shirts/shirt_4.png'], category: 'Shirts', description: 'An elegant dark green shirt that adds a touch of sophistication to your wardrobe, combining classic tailoring with a modern shade.', stock: 10 },
  { name: 'Vibrant Yellow Casual Shirt', price: 799, images: ['/dress/shirts/shirt_5.png'], category: 'Shirts', description: 'Stand out in this bright yellow shirt. Its vibrant color and comfortable fit make it an ideal choice for a confident, energetic look.', stock: 10 },
  { name: 'Executive Dark Red Shirt', price: 1299, images: ['/dress/shirts/shirt_6.png'], category: 'Shirts', description: 'A luxurious dark red/maroon shirt with a subtle sheen, offering a truly executive feel for important occasions and evening wear.', stock: 10 },
  { name: 'Dark Grey Textured Jeans', price: 699, images: ['/dress/pants/jeans_1.png'], category: 'Jeans', description: 'These textured dark grey/black jeans are perfect for the true denim enthusiast. Featuring sturdy construction that develops a unique character over time.', stock: 10 },
  { name: 'Light Blue Cargo Jeans', price: 999, images: ['/dress/pants/jeans_2.png'], category: 'Jeans', description: 'Light blue loose-fit cargo jeans with spacious side pockets. They offer ultimate comfort and utility with a trendy streetwear aesthetic.', stock: 10 },
  { name: 'Classic Blue Straight Jeans', price: 1499, images: ['/dress/pants/jeans_3.png'], category: 'Jeans', description: 'Classic blue denim jeans with a timeless straight leg cut. Essential for any wardrobe, providing versatility and durability.', stock: 10 },
  { name: 'Dark Blue Slim Fit Jeans', price: 999, images: ['/dress/pants/jeans_4.png'], category: 'Jeans', description: 'Dark blue slim fit jeans that offer a sleek and urban look. Engineered with a slight stretch for maximum mobility.', stock: 10 },
  { name: 'Formal Brown Trousers', price: 899, images: ['/dress/pants/pant_1.png'], category: 'Pants', description: 'Formal brown trousers crafted for the modern professional. These pants deliver a sharp, tailored appearance suitable for any office setting.', stock: 10 },
  { name: 'Light Blue Tailored Trousers', price: 1399, images: ['/dress/pants/pant_2.png'], category: 'Pants', description: 'Elegant light blue formal trousers. Their premium fabric and impeccable tailoring ensure you look your best at formal events.', stock: 10 },
  { name: 'Grey Pinstripe Formal Pants', price: 749, images: ['/dress/pants/pant_3.png'], category: 'Pants', description: 'Sophisticated grey trousers with a subtle pinstripe pattern. A classic choice that adds authority to your business attire.', stock: 10 },
  { name: 'Classic Khaki Trousers', price: 1399, images: ['/dress/pants/pant_4.png'], category: 'Pants', description: 'Classic khaki/beige formal trousers offering a comfortable fit and a versatile neutral color that pairs perfectly with any shirt.', stock: 10 },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jackland';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // 1. Clear existing collections
    await Admin.deleteMany({});
    await Product.deleteMany({});

    // 2. Seed Default Admin
    const defaultAdmin = await Admin.create({
      name: 'admin',
      email: 'admin@jackland.com',
      password: '1010_Admin@JackLand.com',
      role: 'admin',
    });
    console.log(`Seeded default admin: ${defaultAdmin.email}`);

    // 3. Seed Default Products
    const seededProducts = await Product.insertMany(defaultProducts);
    console.log(`Seeded ${seededProducts.length} default products.`);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
