import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── SECURITY MIDDLEWARES ──────────────────────────────────────────────────
// Set secure HTTP response headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*', // Allow connections from any frontend during local/staging phases
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers for JSON and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── RATE LIMITING ────────────────────────────────────────────────────────
// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per 15 minutes per IP
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Specific rate limiter for sensitive authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 login/registration requests per 15 minutes per IP
  message: { success: false, error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/register', authLimiter);

// ─── ROOT ROUTE ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Jack Land E-Commerce Backend',
    version: '1.0.0',
    status: 'Healthy',
    timestamp: new Date().toISOString()
  });
});

// ─── API ROUTE HANDLERS ─────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Catch-all for unhandled routes
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  next(error);
});

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
export default app;
