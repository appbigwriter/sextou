import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export const runtime = 'nodejs'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anuncio nao encontrado" }, { status: 404 })
    }

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
    return NextResponse.json({ error: "Erro ao aprovar anuncio" }, { status: 500 })
  }
}
