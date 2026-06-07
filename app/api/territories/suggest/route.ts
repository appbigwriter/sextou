import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTerritorySchema = z.object({
  city: z.string().trim().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().trim().min(2, "Estado deve ter pelo menos 2 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const result = createTerritorySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: result.error.issues },
        { status: 400 }
      )
    }

    const { city, state } = result.data

    // Verifica se já existe (case-insensitive aproximado)
    const existing = await prisma.masterTerritory.findFirst({
      where: {
        city: { equals: city, mode: "insensitive" },
        state: { equals: state, mode: "insensitive" },
      },
    })

    if (existing) {
      // Retorna a existente — não duplica
      return NextResponse.json({
        id: existing.id,
        city: existing.city,
        state: existing.state,
        alreadyExisted: true,
      })
    }

    const territory = await prisma.masterTerritory.create({
      data: {
        city,
        state,
        isActive: true,
      },
    })

    return NextResponse.json({
      id: territory.id,
      city: territory.city,
      state: territory.state,
      alreadyExisted: false,
    })
  } catch (error) {
    console.error("POST territory error:", error)
    return NextResponse.json(
      { error: "Erro ao cadastrar cidade" },
      { status: 500 }
    )
  }
}
