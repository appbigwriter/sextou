import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isConfiguredAdminEmail } from "@/lib/admin"

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

    // Verify ownership or admin
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    const userIsAdmin = (session.user as any).isAdmin || isConfiguredAdminEmail(session.user.email)

    if (ad.user.email !== session.user.email && !userIsAdmin) {
      return NextResponse.json({ error: "Sem permissão para excluir este anúncio" }, { status: 403 })
    }

    // Deleta dependências sem cascade antes de deletar o anúncio
    await prisma.$transaction([
      prisma.lead.deleteMany({ where: { adId: id } }),
      prisma.payment.deleteMany({ where: { adId: id } }),
      prisma.ad.delete({ where: { id } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[AD_DELETE]", error)
    return NextResponse.json({ error: "Erro ao excluir anúncio" }, { status: 500 })
  }
}
