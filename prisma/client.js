import { PrismaClient } from "@prisma/client";

// Create a singleton Prisma client instance
const prisma = new PrismaClient();

// Debug connection
prisma
  .$connect()
  .then(() => console.log("✅ Connected to database"))
  .catch((e) => console.error("❌ Database connection error:", e));

export default prisma;
