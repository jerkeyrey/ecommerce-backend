import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        balance: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to get profile", error: error.message });
  }
};

// Add funds to user balance (renamed to match route import)
export const addFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: parseFloat(amount),
        },
      },
      select: {
        id: true,
        email: true,
        balance: true,
      },
    });

    res.status(200).json({
      message: "Funds added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Add funds error:", error);
    res
      .status(500)
      .json({ message: "Failed to add funds", error: error.message });
  }
};

// Get user's balance
export const getBalance = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { balance: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error("❌ Get Balance Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
