import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

/**
 * Middleware to protect admin-only routes
 */
export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');

      // Offline developer credentials fallback authentication bypass
      if (decoded.id === 'offline-admin-developer-id') {
        req.admin = {
          _id: 'offline-admin-developer-id',
          name: 'admin',
          email: 'admin@jackland.com',
          role: 'admin',
        };
        return next();
      }

      // Safeguard: Check if the token payload id is a valid Mongo ObjectId
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ success: false, error: 'Not authorized, token payload is invalid' });
      }

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(403).json({ success: false, error: 'Access denied: Admin credentials not found' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error('Admin Auth Middleware Error:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

/**
 * Middleware to protect customer-only or general authenticated routes
 */
export const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecretkey');

      // Offline customer credentials fallback check
      if (decoded.id === 'offline-admin-developer-id') {
        req.user = {
          _id: 'offline-admin-developer-id',
          name: 'admin',
          email: 'admin@jackland.com',
          role: 'admin',
        };
        return next();
      }

      // Safeguard: Check if valid Mongo ObjectId
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ success: false, error: 'Not authorized, token payload is invalid' });
      }

      // Check if it's a customer or an admin
      const user = await User.findById(decoded.id).select('-password');
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!user && !admin) {
        return res.status(403).json({ success: false, error: 'Access denied: Account not found' });
      }

      req.user = user || admin;
      next();
    } catch (error) {
      console.error('User Auth Middleware Error:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};
