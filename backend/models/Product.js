import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name/title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Shirts', 'Jeans', 'Pants'],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    colors: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'At least one product image URL is required'],
    },
    image: {
      type: String, // Single image field for backward compatibility with frontend
    },
  },
  {
    timestamps: true,
  }
);

// Auto-fill the 'image' property with the first image from the 'images' array
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
