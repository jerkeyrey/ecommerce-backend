import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  searchProducts, // Ensure this is imported
} from "../controllers/productController.js";
import { authenticateUser } from "../middleware/auth.js";



const router = express.Router();

// Product Routes
router.post("/", authenticateUser, createProduct);      // Create product (sellers only)
router.get("/", getAllProducts);                        // Get all products (open to all)
router.get("/search", searchProducts);                  // Search products (open to all)
router.get("/:id", getProductById);                     // Get product by ID (open to all)
router.delete("/:id", authenticateUser, deleteProduct); // Delete product (seller only)

export default router;