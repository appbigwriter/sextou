import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPaymentSchema = z.object({
  adId: z.string().min(1, "ID do anúncio é obrigatório"),
  paymentMethod: z.enum(["ZELLE", "STRIPE", "PAYPAL"]),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const data = createPaymentSchema.parse(body)

    const ad = await prisma.ad.findUnique({
      where: { id: data.adId },
      include: { user: true },
    })

    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    if (ad.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    if (ad.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Anúncio já foi pago" }, { status: 400 })
    }

    const payment = await prisma.payment.create({
      data: {
        adId: data.adId,
        userId: ad.userId,
        amount: 30.00,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
      },
    })

    await prisma.ad.update({
      where: { id: data.adId },
      data: {
        status: "AWAITING_PAYMENT",
        paymentStatus: "PENDING",
        paymentAmount: 30.00,
      },
    })

    return NextResponse.json({
      payment,
      instructions: data.paymentMethod === "ZELLE" ? {
        name: "Sexta do Empreendedor",
        email: "pagamento@sextadoempreendedor.com",
        amount: 30.00,
        instructions: "Envie o pagamento via Zelle para o email acima e envie o comprovante pelo painel."
      } : null
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