import express from 'express';
import { checkoutCart } from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/auth.js';


const router = express.Router();

// Checkout Route
router.post('/checkout', authenticateUser, checkoutCart);


export default router;