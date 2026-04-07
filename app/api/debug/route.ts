import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(não definido)",
      AUTH_URL: process.env.AUTH_URL || "(não definido)",
      DATABASE_URL: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:([^@]+)@/, ":***@") // oculta senha
        : "(não definido)",
    },
    database: {
      status: "não testado",
      tables: [],
      error: null,
    },
  }

  // Testar conexão com banco
  try {
    await prisma.$queryRaw`SELECT 1 as ok`
    results.database.status = "✅ Conectado"
  } catch (err: any) {
    results.database.status = "❌ Falha na conexão"
    results.database.error = err?.message || String(err)
    return NextResponse.json(results, { status: 503 })
  }

  // Verificar se as tabelas existem
  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `
    results.database.tables = (tables as any[]).map((t) => t.tablename)
    results.database.tablesOk = results.database.tables.includes("users")
      ? "✅ Tabela 'users' existe"
      : "❌ Tabela 'users' NÃO existe — migrations não aplicadas!"
  } catch (err: any) {
    results.database.tablesError = err?.message
  }

  // Testar criar/ler um registro simples
  try {
    const count = await prisma.user.count()
    results.database.userCount = count
    results.database.queryTest = "✅ Query OK"
  } catch (err: any) {
    results.database.queryTest = "❌ Query falhou: " + err?.message
    results.database.queryError = {
      code: err?.code,
      message: err?.message,
    }
  }

  return NextResponse.json(results, { status: 200 })
}
