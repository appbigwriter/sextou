const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.masterTerritory.findMany();
  console.log('Total:', t.length);
  console.log(t.slice(0, 3));
}
main().finally(() => prisma.$disconnect());
