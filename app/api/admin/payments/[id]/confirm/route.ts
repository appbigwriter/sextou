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

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { ad: true },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        confirmedBy: session.user.email,
      },
    })

    await prisma.ad.update({
      where: { id: payment.adId },
      data: {
        status: "UNDER_REVIEW",
        paymentStatus: "PAID",
        paymentDate: new Date(),
      },
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Confirm payment error:", error)
    return NextResponse.json({ error: "Erro ao confirmar pagamento" }, { status: 500 })
  }
}