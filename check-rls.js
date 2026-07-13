const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  try {
    // Checar se RLS está ativo nas tabelas principais
    const rlsStatus = await p.$queryRaw`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'ads', 'categories', 'videos', 'images')
      ORDER BY tablename
    `;
    console.log('\n=== STATUS RLS NAS TABELAS PRINCIPAIS ===');
    console.log(rlsStatus);

    // Checar se consegue inserir uma categoria (auto-seed)
    console.log('\n=== TENTANDO AUTO-SEED DE CATEGORIA ===');
    const result = await p.category.upsert({
      where: { slug: 'alimentacao' },
      update: { name: 'Alimentacao', icon: 'Pizza', order: 1, isActive: true },
      create: { name: 'Alimentacao', slug: 'alimentacao', icon: 'Pizza', order: 1, isActive: true },
    });
    console.log('Categoria criada/atualizada:', result.name, '| id:', result.id);

    const count = await p.category.count();
    console.log('Total categorias agora:', count);

  } catch (e) {
    console.error('ERRO:', e.message);
    if (e.code) console.error('Codigo Prisma:', e.code);
    if (e.meta) console.error('Meta:', JSON.stringify(e.meta));
  } finally {
    await p.$disconnect();
  }
}

main();
