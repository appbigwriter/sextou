import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminApi } from "@/lib/admin"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminApi()

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { ad: true },
    })

    if (!payment) {
      return NextResponse.json({ error: "Pagamento nao encontrado" }, { status: 404 })
    }

    if (
      payment.paymentMethod === "ZELLE" &&
      (!payment.transactionId || !(payment as any).transactionDate)
    ) {
      return NextResponse.json(
        { error: "Informe codigo e data do pagamento Zelle antes de confirmar." },
        { status: 400 }
      )
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        confirmedBy: adminCheck.session.user.email,
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
