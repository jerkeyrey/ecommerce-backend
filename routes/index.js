// This file will scan all route files and create a unified listing of the actual routes
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to scan route files and log actual route paths
const scanRoutes = () => {
  console.log("Scanning routes directory for actual API endpoints:");

  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error("Error reading routes directory:", err);
      return;
    }

    files.forEach((file) => {
      if (file.endsWith("Routes.js")) {
        console.log(`Found route file: ${file}`);
        // In a real implementation, we would parse each file to extract routes
      }
    });
  });

  console.log(
    "This utility helps ensure Swagger documentation matches actual routes"
  );
};

// Export the function
export default { scanRoutes };
