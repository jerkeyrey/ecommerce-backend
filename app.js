import express from "express";
import dotenv from "dotenv";
import { EventEmitter } from "events";

// Set higher max listeners to prevent warnings
EventEmitter.defaultMaxListeners = 15;

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes); // Add coupon routes

// Root route
app.get("/", (req, res) => {
  res.send("E-commerce API is running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("⚠️ Global error:", err);
  res.status(500).json({ error: "Server error", message: err.message });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
