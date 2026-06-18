import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, email: true, fullName: true, hasActiveAds: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { hasActiveAds: !currentUser.hasActiveAds },
      select: {
        id: true,
        email: true,
        fullName: true,
        hasActiveAds: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Toggle active ads error:", error)
    return NextResponse.json({ error: "Erro ao atualizar anuncios ativos" }, { status: 500 })
  }
}
