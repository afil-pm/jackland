import express from 'express';
import { loginAdmin, registerAdmin, getDashboardStats } from '../controllers/adminController.js';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ─── ADMIN AUTHENTICATION ──────────────────────────────────────────────────
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// ─── ADMIN DASHBOARD STATISTICS ────────────────────────────────────────────
router.get('/stats', protectAdmin, getDashboardStats);

// ─── ADMIN PRODUCT MANAGEMENT ──────────────────────────────────────────────
router.post('/products', protectAdmin, upload.array('images', 6), createProduct);
router.put('/products/:id', protectAdmin, upload.array('images', 6), updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct);

// ─── ADMIN ORDER MANAGEMENT ────────────────────────────────────────────────
router.get('/orders', protectAdmin, getOrders);
router.put('/orders/:id', protectAdmin, updateOrderStatus);

export default router;
