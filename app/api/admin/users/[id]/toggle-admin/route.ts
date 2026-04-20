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
    const currentUser = await (prisma.user as any).findUnique({
      where: { id: params.id },
      select: { id: true, isAdmin: true, email: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 })
    }

    if (currentUser.email === adminCheck.session.user.email && currentUser.isAdmin) {
      return NextResponse.json(
        { error: "Voce nao pode remover o proprio acesso admin por esta tela" },
        { status: 400 }
      )
    }

    const updatedUser = await (prisma.user as any).update({
      where: { id: params.id },
      data: { isAdmin: !currentUser.isAdmin },
      select: {
        id: true,
        email: true,
        fullName: true,
        isAdmin: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Toggle admin error:", error)
    return NextResponse.json({ error: "Erro ao atualizar permissao admin" }, { status: 500 })
  }
}
