import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new product (for sellers only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);

    // Ensure user is authenticated and is a SELLER
    if (!req.user || req.user.role !== "SELLER") {
      return res
        .status(403)
        .json({ message: "Only sellers can create products" });
    }

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: stock || 0,
        inStock: stock > 0,
        sellerId: req.user.id,
      },
    });

    console.log("Product Created:", product);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};

// Get all products (for buyers to browse)
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true }, // Only available products
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product (only the seller who created it can delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.user.id !== product.sellerId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this product" });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {
      AND: [],
    };

    // Fuzzy search on product name
    if (query) {
      filters.AND.push({
        name: {
          contains: query,
          mode: "insensitive",
        },
      });
    }

    // Filter by category
    if (category) {
      filters.AND.push({
        category: {
          equals: category,
          mode: "insensitive",
        },
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filters.AND.push({
        price: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Fetch products
    const products = await prisma.product.findMany({
      where: filters,
      skip,
      take,
    });

    // Total count for pagination
    const totalProducts = await prisma.product.count({ where: filters });

    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / take),
      currentPage: parseInt(page),
      products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
