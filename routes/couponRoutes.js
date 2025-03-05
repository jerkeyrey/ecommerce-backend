import express from "express";
import {
  createCoupon,
  getSellerCoupons,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Seller routes
router.post("/", authenticateUser, createCoupon); // Create new coupon
router.get("/", authenticateUser, getSellerCoupons); // Get seller's coupons
router.patch("/:id/toggle", authenticateUser, toggleCouponStatus); // Toggle coupon active status
router.delete("/:id", authenticateUser, deleteCoupon); // Delete coupon

// Customer routes
router.post("/validate", authenticateUser, validateCoupon); // Validate coupon

export default router;
