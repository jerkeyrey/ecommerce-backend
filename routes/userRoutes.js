import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Add balance to user
router.post("/add-balance", authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: { increment: amount } },
    });

    return res.json({ message: "Balance updated", balance: updatedUser.balance });
  } catch (error) {
    console.error("❌ Error updating balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;