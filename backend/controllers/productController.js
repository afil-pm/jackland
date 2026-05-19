import Product from '../models/Product.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Static default products to fallback on if database is offline or unseeded
const defaultProducts = [
  { id: 's1', _id: 's1', name: 'Solid Brown Formal Shirt', price: 999, image: '/dress/shirts/shirt_1.png', images: ['/dress/shirts/shirt_1.png'], category: 'Shirts', description: 'A stylish solid brown shirt that brings a modern twist to professional attire.', stock: 10 },
  { id: 's2', _id: 's2', name: 'Grey Double-Pocket Casual Shirt', price: 899, image: '/dress/shirts/shirt_2.png', images: ['/dress/shirts/shirt_2.png'], category: 'Shirts', description: 'This comfortable grey/slate shirt features double chest pockets.', stock: 10 },
  { id: 's3', _id: 's3', name: 'Classic Maroon Shirt', price: 899, image: '/dress/shirts/shirt_3.png', images: ['/dress/shirts/shirt_3.png'], category: 'Shirts', description: 'A bold maroon shirt designed with premium cotton.', stock: 10 },
  { id: 's4', _id: 's4', name: 'Dark Green Tailored Shirt', price: 1199, image: '/dress/shirts/shirt_4.png', images: ['/dress/shirts/shirt_4.png'], category: 'Shirts', description: 'An elegant dark green shirt that adds a touch of sophistication.', stock: 10 },
  { id: 'p1', _id: 'p1', name: 'Dark Grey Textured Jeans', price: 699, image: '/dress/pants/jeans_1.png', images: ['/dress/pants/jeans_1.png'], category: 'Jeans', description: 'These textured dark grey/black jeans are perfect for the true denim enthusiast.', stock: 10 },
  { id: 'p2', _id: 'p2', name: 'Light Blue Cargo Jeans', price: 999, image: '/dress/pants/jeans_2.png', images: ['/dress/pants/jeans_2.png'], category: 'Jeans', description: 'Light blue cargo jeans with spacious side pockets.', stock: 10 },
  { id: 'p5', _id: 'p5', name: 'Formal Brown Trousers', price: 899, image: '/dress/pants/pant_1.png', images: ['/dress/pants/pant_1.png'], category: 'Pants', description: 'Formal brown trousers crafted for the modern professional.', stock: 10 },
  { id: 'p6', _id: 'p6', name: 'Light Blue Tailored Trousers', price: 1399, image: '/dress/pants/pant_2.png', images: ['/dress/pants/pant_2.png'], category: 'Pants', description: 'Elegant light blue formal trousers.', stock: 10 }
];

/**
 * Get all products (with search, category filter, and database offline fallbacks)
 * Route: GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { q, category } = req.query;

    const queryObj = {};
    if (category) {
      queryObj.category = category;
    }
    if (q) {
      queryObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Attempt retrieval from MongoDB with a short timeout
    const products = await Product.find(queryObj)
      .sort({ createdAt: -1 })
      .maxTimeMS(1500);

    if (products && products.length > 0) {
      return res.json(products);
    }

    // DB was connected but empty: return filtered defaults
    let filtered = [...defaultProducts];
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (q) {
      const search = q.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    }
    res.json(filtered);
  } catch (error) {
    console.warn(`⚠️ MongoDB products fetch failed (${error.message}). Serving static fallbacks.`);
    
    // DB was offline or timed out: return filtered defaults
    const { q, category } = req.query;
    let filtered = [...defaultProducts];
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (q) {
      const search = q.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    }
    res.json(filtered);
  }
};

/**
 * Get product by ID (with database offline fallback)
 * Route: GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).maxTimeMS(1500);
    if (product) {
      return res.json(product);
    }
  } catch (error) {
    console.warn(`⚠️ MongoDB product search failed (${error.message}). Searching static catalog.`);
  }

  // Fallback to static products list search
  const staticProduct = defaultProducts.find((p) => p.id === req.params.id);
  if (staticProduct) {
    return res.json(staticProduct);
  }

  res.status(404).json({ error: 'Product not found' });
};

/**
 * Create a new Product (Admin only)
 * Route: POST /api/admin/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, sizes, colors, stock } = req.body;

    if (!name || !price || !category) {
      res.status(400);
      throw new Error('Name, price and category are required');
    }

    let imageUrls = [];

    // Upload files to Cloudinary if available
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'jack-land/products')
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else if (req.body.image) {
      imageUrls = [req.body.image];
    }

    if (imageUrls.length === 0) {
      imageUrls = ['/dress/shirts/shirt_1.png'];
    }

    // Process sizes/colors
    let parsedSizes = ['S', 'M', 'L', 'XL', 'XXL'];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? sizes.split(',').map((s) => s.trim()) : sizes;
    }
    let parsedColors = [];
    if (colors) {
      parsedColors = typeof colors === 'string' ? colors.split(',').map((c) => c.trim()) : colors;
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      stock: parseInt(stock) || 0,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Product (Admin only)
 * Route: PUT /api/admin/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { name, description, price, category, sizes, colors, stock } = req.body;

    let imageUrls = product.images;

    // Check for new file uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'jack-land/products')
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else if (req.body.image) {
      imageUrls = [req.body.image];
    }

    // Update fields
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (imageUrls) product.images = imageUrls;

    if (sizes) {
      product.sizes = typeof sizes === 'string' ? sizes.split(',').map((s) => s.trim()) : sizes;
    }
    if (colors) {
      product.colors = typeof colors === 'string' ? colors.split(',').map((c) => c.trim()) : colors;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Product (Admin only)
 * Route: DELETE /api/admin/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};
