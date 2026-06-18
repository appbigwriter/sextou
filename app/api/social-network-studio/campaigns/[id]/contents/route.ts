import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 })
    }

    const contents = await prisma.socialNetworkContent.findMany({
      where: {
        campaignId: params.id,
        campaign: {
          project: {
            userId: user.id
          }
        }
      },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json(contents)
  } catch (err: any) {
    return new NextResponse(err.message || "Erro interno", { status: 500 })
  }
}
