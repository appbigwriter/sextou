import { NextResponse } from "next/server"
import { requireSextouToolsPremiumApiUser } from "@/lib/sextou-tools/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const proUser = await requireSextouToolsPremiumApiUser()
    if (proUser === null) {
      return new NextResponse("Não autorizado", { status: 401 })
    }
    if (proUser === false) {
      return new NextResponse("Acesso restrito ao Pacote PRO Premium", { status: 403 })
    }
    const user = proUser

    const { searchParams } = new URL(req.url)
    const planId = searchParams.get("planId")

    if (!planId) {
      return new NextResponse("planId é obrigatório", { status: 400 })
    }

    const items = await prisma.youtubeContentItem.findMany({
      where: {
        planId,
        plan: { userId: user.id }
      },
      orderBy: { scheduledDate: "asc" }
    })

    return NextResponse.json({ items })
  } catch (err: any) {
    return new NextResponse(err.message || "Erro interno", { status: 500 })
  }
}
