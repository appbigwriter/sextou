import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()
  if (!adminCheck.ok) return adminCheck.response

  try {
    const { reason } = await request.json()

    await prisma.ad.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    })

    return NextResponse.json({ message: "Anuncio rejeitado" })
  } catch (error) {
    console.error("Reject error:", error)
    return NextResponse.json({ error: "Erro ao rejeitar" }, { status: 500 })
  }
}