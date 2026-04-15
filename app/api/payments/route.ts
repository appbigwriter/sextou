import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createPaymentSchema = z.object({
  adId: z.string().min(1, "ID do anuncio e obrigatorio"),
  paymentMethod: z.enum(["ZELLE", "STRIPE", "PAYPAL"]),
  transactionId: z.string().trim().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const data = createPaymentSchema.parse(body)

    const ad = await prisma.ad.findUnique({
      where: { id: data.adId },
      include: { user: true },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anuncio nao encontrado" }, { status: 404 })
    }

    if (ad.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    if (ad.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Anuncio ja foi pago" }, { status: 400 })
    }

    if (data.paymentMethod === "ZELLE" && !data.transactionId) {
      return NextResponse.json({ error: "Informe o codigo da transacao Zelle" }, { status: 400 })
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        adId: data.adId,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    })

    const payment = existingPayment
      ? await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            amount: 30.0,
            transactionId: data.transactionId || existingPayment.transactionId,
          },
        })
      : await prisma.payment.create({
          data: {
            adId: data.adId,
            userId: ad.userId,
            amount: 30.0,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId || null,
            status: "PENDING",
          },
        })

    await prisma.ad.update({
      where: { id: data.adId },
      data: {
        status: "AWAITING_PAYMENT",
        paymentStatus: "PENDING",
        paymentAmount: 30.0,
      },
    })

    return NextResponse.json({
      payment,
      instructions:
        data.paymentMethod === "ZELLE"
          ? {
              name: "Sexta do Empreendedor",
              email: "pagamento@sextadoempreendedor.com",
              amount: 30.0,
              instructions:
                "Envie o pagamento via Zelle, informe o codigo da transacao no painel e aguarde a confirmacao do admin.",
            }
          : null,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Create payment error:", error)
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adId = searchParams.get("adId")

    const where = adId ? { adId } : {}

    const payments = await prisma.payment.findMany({
      where,
      include: {
        ad: true,
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Get payments error:", error)
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 })
  }
}
