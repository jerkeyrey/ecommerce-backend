import fs from "fs";
import path from "path";

const controllersDir = path.join(process.cwd(), "controllers");
const files = fs
  .readdirSync(controllersDir)
  .filter((file) => file.endsWith(".js"));

for (const file of files) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Replace PrismaClient import and instantiation with centralized client import
  const importRegex =
    /import\s+{\s*PrismaClient\s*}\s+from\s+['"]@prisma\/client['"];?\s*const\s+prisma\s*=\s*new\s+PrismaClient\s*\(\s*\)\s*;?/g;
  const newImport = `import prisma from '../prisma/client.js';`;

  if (importRegex.test(content)) {
    content = content.replace(importRegex, newImport);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated ${file} to use centralized Prisma client`);
  } else {
    console.log(`⚠️ No changes made to ${file} - import pattern not found`);
  }
}

console.log("Done!");
