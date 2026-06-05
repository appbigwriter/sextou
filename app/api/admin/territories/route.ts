import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const adminAuth = await isAdmin(session.user.email)
    if (!adminAuth) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const territories = await prisma.affiliateTerritory.findMany({
      include: {
        affiliate: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        territory: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(territories)
  } catch (error) {
    console.error("GET territories error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar territorios" },
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
    const { affiliateId, territoryId } = body

    if (!affiliateId || !territoryId) {
      return NextResponse.json(
        { error: "Dados incompletos. Informe affiliateId e territoryId." },
        { status: 400 }
      )
    }

    // Verify affiliate exists
    const affiliate = await prisma.user.findUnique({
      where: { id: affiliateId },
    })

    if (!affiliate) {
      return NextResponse.json({ error: "Afiliado nao encontrado" }, { status: 404 })
    }

    // Check if it already exists to prevent duplicates
    const existing = await prisma.affiliateTerritory.findFirst({
      where: {
        affiliateId,
        territoryId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Este afiliado ja esta designado para este territorio." },
        { status: 400 }
      )
    }

    const territory = await prisma.affiliateTerritory.create({
      data: {
        affiliateId,
        territoryId,
      },
      include: {
        affiliate: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        territory: true,
      },
    })

    return NextResponse.json(territory)
  } catch (error) {
    console.error("POST territories error:", error)
    return NextResponse.json(
      { error: "Erro ao criar territorio" },
      { status: 500 }
    )
  }
}
