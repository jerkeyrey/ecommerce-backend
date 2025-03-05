import { PrismaClient } from "@prisma/client";

// Declare with let instead of const to allow reassignment
let prisma = new PrismaClient();

try {
  // Try to import from the centralized client
  const importedPrisma = await import("../prisma/client.js");
  prisma = importedPrisma.default;
  console.log("✅ Coupon controller: Using imported Prisma client");
} catch (error) {
  // Fallback to a new instance if import fails
  console.error(
    "❌ Failed to import Prisma client, creating new instance:",
    error
  );
  // No need to reassign since prisma is already initialized
}

// Create a new coupon (seller only)
export const createCoupon = async (req, res) => {
  try {
    console.log("Creating coupon... Prisma client available:", !!prisma);

    const { code, discount } = req.body;
    const sellerId = req.user.id;

    // Validate user is a seller
    if (req.user.role !== "SELLER") {
      return res.status(403).json({ error: "Only sellers can create coupons" });
    }

    // Basic validation
    if (!code || !discount || discount <= 0 || discount > 100) {
      return res.status(400).json({
        error: "Valid code and discount percentage (1-100) are required",
      });
    }

    console.log("Checking for existing coupon with code:", code);

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    console.log("Creating new coupon for seller:", sellerId);

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        discount: parseFloat(discount),
        sellerId,
      },
    });

    console.log("Coupon created successfully:", coupon);

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({
      error: "Failed to create coupon",
      details: error.message,
      stack: error.stack,
    });
  }
};

// Get all coupons for a seller
export const getSellerCoupons = async (req, res) => {
  try {
    const sellerId = req.user.id;

    if (req.user.role !== "SELLER") {
      return res.status(403).json({ error: "Access denied" });
    }

    const coupons = await prisma.coupon.findMany({
      where: { sellerId },
    });

    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};

// Toggle coupon active status
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    if (req.user.role !== "SELLER") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    // Ensure the seller owns the coupon
    if (coupon.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ error: "You don't have permission to modify this coupon" });
    }

    // Toggle active status
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { isActive: !coupon.isActive },
    });

    res.status(200).json({
      message: updatedCoupon.isActive
        ? "Coupon activated"
        : "Coupon deactivated",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ error: "Failed to update coupon" });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    if (req.user.role !== "SELLER") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { id: parseInt(id) },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    // Ensure the seller owns the coupon
    if (coupon.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this coupon" });
    }

    // Delete coupon
    await prisma.coupon.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ error: "Failed to delete coupon" });
  }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    // Get the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    // Validate coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ error: "This coupon is no longer active" });
    }

    res.status(200).json({
      valid: true,
      discount: coupon.discount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ error: "Failed to validate coupon" });
  }
};
