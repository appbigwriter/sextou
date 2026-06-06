import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const territories = await prisma.masterTerritory.findMany({
      where: { isActive: true },
      orderBy: [{ state: "asc" }, { city: "asc" }],
      select: {
        id: true,
        city: true,
        state: true,
      }
    })
    return NextResponse.json(territories)
  } catch (error) {
    console.error("GET public territories error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cidades" },
      { status: 500 }
    )
  }
}
