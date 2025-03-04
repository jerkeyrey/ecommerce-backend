import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new product (for sellers only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        sellerId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all products (for buyers to browse)
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a product (only seller who created it can delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (req.user.id !== product.sellerId) {
      return res.status(403).json({ error: 'Unauthorized to delete this product' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};