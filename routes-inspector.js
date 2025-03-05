#!/usr/bin/env node

/**
 * This script inspects all route files and logs the actual routes defined
 * to help ensure Swagger documentation matches your actual API endpoints.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routesDir = path.join(__dirname, "routes");

console.log("📋 E-commerce API Routes Inspector");
console.log("=================================");
console.log(
  "This utility will help identify all API routes in your application.\n"
);

// Function to extract routes from a file
const extractRoutes = (filePath, basePath = "") => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const filename = path.basename(filePath);
    const moduleType = filename.replace("Routes.js", "");

    console.log(`\n🔍 Examining ${filename}...`);

    // Extract route definitions
    // This is a simple regex approach and might need refinement
    const routeRegex =
      /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"],.*?\)/g;

    let match;
    const routes = [];

    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      const fullPath = basePath + "/" + moduleType + routePath;

      routes.push({ method, path: routePath, fullPath });
    }

    if (routes.length === 0) {
      console.log(`   No routes found in ${filename}`);
    } else {
      console.log(`   Found ${routes.length} routes in ${filename}:`);
      routes.forEach((route) => {
        console.log(`   - ${route.method.padEnd(6)} ${route.fullPath}`);
      });
    }

    return routes;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return [];
  }
};

// Get all route files
try {
  const files = fs.readdirSync(routesDir);
  const routeFiles = files.filter((file) => file.endsWith("Routes.js"));

  console.log(`Found ${routeFiles.length} route files in ${routesDir}`);

  // Extract routes from each file
  routeFiles.forEach((file) => {
    const filePath = path.join(routesDir, file);
    extractRoutes(filePath, "/api");
  });

  console.log("\n✅ Route inspection completed.");
  console.log(
    "\nUse this information to ensure your Swagger documentation matches the actual routes."
  );
} catch (error) {
  console.error("Error reading routes directory:", error);
}
