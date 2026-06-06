const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const res = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name='master_territories'`);
  console.log(res);
}
main().finally(() => prisma.$disconnect());
