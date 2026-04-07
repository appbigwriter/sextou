import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    // Aprovar e publicar
    const updatedAd = await prisma.ad.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })

    return NextResponse.json(updatedAd)
  } catch (error) {
    console.error("Approve ad error:", error)
    return NextResponse.json(
      { error: "Erro ao aprovar anúncio" },
      { status: 500 }
    )
  }
}