import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponCode } = req.body;

    // Fetch user's cart with items and products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Calculate total and check stock availability
    let totalAmount = 0;
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          error: `Not enough stock for product: ${item.product.name}`,
        });
      }
      totalAmount += item.quantity * item.product.price;
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      // Find and validate coupon
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) {
        return res.status(400).json({ error: "Invalid coupon code." });
      }

      if (!coupon.isActive) {
        return res
          .status(400)
          .json({ error: "This coupon is no longer active." });
      }

      // Calculate simple discount
      discountAmount = (totalAmount * coupon.discount) / 100;
      appliedCouponCode = couponCode;

      // Apply discount to total
      totalAmount -= discountAmount;
    }

    // Validate user balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.balance < totalAmount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        items: JSON.stringify(cart.items),
        totalAmount,
        status: "completed",
        couponCode: appliedCouponCode,
        discountAmount,
      },
    });

    // Update stock levels
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          inStock: { set: item.product.stock - item.quantity > 0 },
        },
      });
    }

    // Deduct from user balance
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: totalAmount } },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Return success response
    res.status(201).json({
      message: "Order placed successfully.",
      order,
      discountApplied: discountAmount > 0,
      discountAmount,
      finalTotal: totalAmount,
    });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
