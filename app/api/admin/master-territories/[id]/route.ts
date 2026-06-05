import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const adminAuth = await isAdmin(session.user.email)
    if (!adminAuth) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    await prisma.masterTerritory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE master territory error:", error)
    return NextResponse.json(
      { error: "Erro ao remover cidade (ela pode estar em uso)" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { isActive } = body

    const territory = await prisma.masterTerritory.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json(territory)
  } catch (error) {
    console.error("PATCH master territory error:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar status da cidade" },
      { status: 500 }
    )
  }
}
