import express from "express";
import dotenv from "dotenv";
import { EventEmitter } from "events";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

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

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "E-commerce backend API documentation",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./swagger/*.js", "./routes/*.js"], // Path to the API docs files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("E-commerce API is running. Access documentation at /api-docs");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("⚠️ Global error:", err);
  res.status(500).json({ error: "Server error", message: err.message });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `✅ Server running on port ${PORT}. Swagger docs available at http://localhost:${PORT}/api-docs`
  )
);
