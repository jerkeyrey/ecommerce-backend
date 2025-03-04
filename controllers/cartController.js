import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.inStock || product.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Product out of stock or insufficient quantity" });
    }

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === parseInt(productId)
    );

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });

      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem: updatedItem,
      });
    }

    // Add new item to cart
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity,
      },
      include: { product: true },
    });

    return res.status(201).json({
      message: "Item added to cart",
      cartItem: newItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the specific cart item
    const cartItem = cart.items.find(
      (item) => item.productId === parseInt(productId)
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Delete the item if quantity is 0
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: cartItem.id, // Use the item's ID from the found cart item
        },
      });

      return res.status(200).json({
        message: "Item removed from cart",
      });
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: { product: true },
    });

    return res.status(200).json({
      message: "Cart updated successfully",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    return res
      .status(500)
      .json({ message: "Failed to update cart", error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the specific cart item
    const cartItem = cart.items.find(
      (item) => item.productId === parseInt(productId)
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return res.status(200).json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove item", error: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart with items and product details
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      // Return empty cart if none exists yet
      return res.status(200).json({
        id: null,
        userId,
        items: [],
        total: 0,
      });
    }

    // Calculate total cart value
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return res.status(200).json({
      ...cart,
      total,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch cart", error: error.message });
  }
};
