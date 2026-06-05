import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi, isConfiguredAdminEmail } from "@/lib/admin"

export const runtime = "nodejs"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const targetUser = await (prisma.user as any).findUnique({
      where: { id: params.id },
      select: { id: true, email: true, fullName: true, isAdmin: true, _count: { select: { ads: true } } },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Impede excluir a própria conta
    if (targetUser.email === adminCheck.session.user.email) {
      return NextResponse.json(
        { error: "Você não pode excluir a sua própria conta por esta tela." },
        { status: 400 }
      )
    }

    // Impede excluir admins configurados via ADMIN_EMAILS
    if (isConfiguredAdminEmail(targetUser.email)) {
      return NextResponse.json(
        { error: "Não é possível excluir um admin configurado via ADMIN_EMAILS." },
        { status: 400 }
      )
    }

    // Exclui dependências em sequência para evitar erros de FK
    await prisma.$transaction(async (tx) => {
      // 1. Leads dos anúncios do usuário
      const userAds = await (tx.ad as any).findMany({
        where: { userId: params.id },
        select: { id: true },
      })
      const adIds = userAds.map((ad: { id: string }) => ad.id)

      if (adIds.length > 0) {
        await (tx.lead as any).deleteMany({ where: { adId: { in: adIds } } })
        await (tx.payment as any).deleteMany({ where: { adId: { in: adIds } } })
        await (tx.ad as any).deleteMany({ where: { userId: params.id } })
      }

      // 2. Pagamentos diretos do usuário que sobrem
      await (tx.payment as any).deleteMany({ where: { userId: params.id } })

      // 3. Notificações
      await (tx.notification as any).deleteMany({ where: { userId: params.id } })

      // 4. Tokens de redefinição de senha
      await (tx.passwordResetToken as any).deleteMany({ where: { userId: params.id } })

      // 5. Remover vínculo de afiliados (setar null nos filhos que apontam para este user)
      await (tx.user as any).updateMany({
        where: { affiliateId: params.id },
        data: { affiliateId: null },
      })

      // 6. Finalmente, excluir o usuário
      await (tx.user as any).delete({ where: { id: params.id } })
    })

    return NextResponse.json({ success: true, message: "Usuário excluído com sucesso." })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Erro ao excluir usuário." }, { status: 500 })
  }
}
