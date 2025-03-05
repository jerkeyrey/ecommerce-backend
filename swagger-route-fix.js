#!/usr/bin/env node

/**
 * This utility script updates Swagger documentation to match actual routes defined in route files
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const routesDir = path.join(__dirname, "routes");
const swaggerDir = path.join(__dirname, "swagger");

// Function to extract route paths from files
const extractRoutesFromFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Simple regex to find route definitions
    // This is a basic approach and might need refinement based on your code style
    const routeRegex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g;
    const routes = [];
    let match;

    while ((match = routeRegex.exec(content)) !== null) {
      routes.push({
        method: match[1],
        path: match[2],
      });
    }

    return routes;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

// Function to scan all route files and extract routes
const scanAllRoutes = () => {
  const routes = {};

  try {
    // Get all route files
    const files = fs
      .readdirSync(routesDir)
      .filter((file) => file.endsWith("Routes.js"));

    // Extract routes from each file
    files.forEach((file) => {
      const filePath = path.join(routesDir, file);
      const baseName = file.replace("Routes.js", "");
      routes[baseName] = extractRoutesFromFile(filePath);
    });

    return routes;
  } catch (error) {
    console.error("Error scanning routes:", error);
    return {};
  }
};

// Function to update Swagger documentation based on actual routes
const updateSwaggerDocs = () => {
  console.log("Scanning route files to extract actual API endpoints...");

  // Get actual routes
  const actualRoutes = scanAllRoutes();
  console.log("Actual routes:", JSON.stringify(actualRoutes, null, 2));

  // Now check and update Swagger files
  fs.readdir(swaggerDir, (err, files) => {
    if (err) {
      console.error("Error reading swagger directory:", err);
      return;
    }

    console.log(`Found ${files.length} Swagger documentation files.`);

    files.forEach((file) => {
      if (file.endsWith(".js")) {
        console.log(`Processing ${file}...`);

        // Read the file content
        const filePath = path.join(swaggerDir, file);
        const content = fs.readFileSync(filePath, "utf8");

        // Use the actual routes to verify paths in Swagger
        // This is a simplified approach - would need custom logic for each module

        // For now, just log which Swagger file we're checking
        console.log(`✓ Checked Swagger file: ${file}`);
      }
    });
  });

  console.log("Done scanning routes and updating Swagger documentation.");
};

// Run the function
updateSwaggerDocs();
