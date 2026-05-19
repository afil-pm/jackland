import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, // product ID
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
    },
    shippingAddress: {
      type: String,
      required: [true, 'Shipping address is required'],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmedAt: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate a clean Order ID and formatted date string if not provided
orderSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  if (!this.date) {
    this.date = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
