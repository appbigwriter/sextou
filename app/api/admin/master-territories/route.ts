import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const territories = await prisma.masterTerritory.findMany({
      orderBy: [{ state: "asc" }, { city: "asc" }],
    })
    return NextResponse.json(territories)
  } catch (error) {
    console.error("GET master-territories error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cidades" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const adminAuth = await isAdmin(session.user.email)
    if (!adminAuth) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { city, state, country } = body

    if (!city || !state) {
      return NextResponse.json(
        { error: "Dados incompletos. Informe city e state." },
        { status: 400 }
      )
    }

    const territoryCountry = country?.trim() || ""

    const existing = await prisma.masterTerritory.findFirst({
      where: {
        city: city.trim(),
        state: state.trim(),
        country: territoryCountry,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Esta cidade ja esta cadastrada." },
        { status: 400 }
      )
    }

    const territory = await prisma.masterTerritory.create({
      data: {
        city: city.trim(),
        state: state.trim(),
        country: territoryCountry,
      },
    })

    return NextResponse.json(territory)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar cidade" },
      { status: 500 }
    )
  }
}
