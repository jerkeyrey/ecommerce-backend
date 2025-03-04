import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { balance: 1000 },
  });
  console.log("✅ User balances initialized!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());