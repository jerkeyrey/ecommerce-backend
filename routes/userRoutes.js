import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  getProfile,
  addFunds,
  getBalance,
} from "../controllers/userController.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log("🔍 User Routes - Request:", req.method, req.path);
  next();
});

// Protected user routes
router.get("/profile", authenticateUser, getProfile);
router.post("/add-funds", authenticateUser, addFunds);
router.get("/balance", authenticateUser, getBalance);

export default router;
