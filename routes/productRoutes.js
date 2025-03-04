import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.post('/', authenticate, createProduct);      // Create product (sellers only)
router.get('/', getAllProducts);                    // Get all products (open to all)
router.get('/:id', getProductById);                 // Get product by ID (open to all)
router.delete('/:id', authenticate, deleteProduct); // Delete product (seller only)

export default router;