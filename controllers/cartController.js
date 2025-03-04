import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    // Check if the product exists and is in stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.inStock) {
      return res.status(404).json({ error: 'Product not found or out of stock' });
    }

    // Find or create a cart for the user
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if product is already in the cart
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Ensure cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.body;
    const userId = req.user.id;

    // Ensure cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get User's Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', cart: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};