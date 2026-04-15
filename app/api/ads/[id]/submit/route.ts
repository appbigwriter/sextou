import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))
    }

    const ad = await prisma.ad.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anuncio nao encontrado" }, { status: 404 })
    }

    if (ad.status !== "DRAFT" && ad.status !== "REJECTED") {
      return NextResponse.json(
        { error: "Este anuncio nao pode ser enviado para analise nesse momento" },
        { status: 400 }
      )
    }

    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        status: "UNDER_REVIEW",
        rejectionReason: null,
        adminNotes: null,
      },
    })

    return NextResponse.redirect(
      new URL(`/dashboard/anuncios/${ad.id}?submitted=1`, process.env.NEXTAUTH_URL || "http://localhost:3000")
    )
  } catch (error) {
    console.error("Submit ad error:", error)
    return NextResponse.json({ error: "Erro ao enviar anuncio para analise" }, { status: 500 })
  }
}
