import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's cart with items and products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
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

    // Validate user balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance.' });
    }

    // Create an order
    const order = await prisma.order.create({
      data: {
        userId,
        items: JSON.stringify(cart.items),
        totalAmount,
        status: 'completed',
      },
    });

    // Deduct stock and clear cart
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: totalAmount } },
    });

    await prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } },
    });

    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    console.error('❌ Checkout Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

