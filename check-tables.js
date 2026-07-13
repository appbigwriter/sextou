const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  try {
    const users = await p.user.count();
    const ads = await p.ad.count();
    const categories = await p.category.count();
    console.log('users:', users, '| ads:', ads, '| categories:', categories);
  } catch (e) {
    console.error('ERRO ao contar tabelas:', e.message);
    // Tentar uma query raw para ver se as tabelas existem
    try {
      const tables = await p.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
      console.log('Tabelas existentes:', tables.map(t => t.table_name).join(', '));
    } catch (e2) {
      console.error('ERRO raw query:', e2.message);
    }
  } finally {
    await p.$disconnect();
  }
}

main();
