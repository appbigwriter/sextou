import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    if (ad.user.email !== session.user.email) {
      return NextResponse.json({ error: "Sem permissão para excluir este anúncio" }, { status: 403 })
    }

    // Delete the ad (cascading images)
    await prisma.ad.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[AD_DELETE]", error)
    return NextResponse.json({ error: "Erro ao excluir anúncio" }, { status: 500 })
  }
}
