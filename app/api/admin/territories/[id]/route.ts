import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminAuth = await isAdmin()
    if (!adminAuth) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const territory = await prisma.affiliateTerritory.findUnique({
      where: { id: params.id },
    })

    if (!territory) {
      return NextResponse.json(
        { error: "Territorio nao encontrado" },
        { status: 404 }
      )
    }

    await prisma.affiliateTerritory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE territory error:", error)
    return NextResponse.json(
      { error: "Erro ao remover territorio" },
      { status: 500 }
    )
  }
}
