import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Cart routes (protected by auth middleware)
router.post("/add", authenticateUser, addToCart); // Add item to cart
router.patch("/update", authenticateUser, updateCartItem); // Update cart item
router.delete("/remove", authenticateUser, removeFromCart); // Remove item
router.get("/", authenticateUser, getCart); // Get user's cart

export default router;
