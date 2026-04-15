import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession, PRICE_PER_AD } from "@/lib/stripe"

const checkoutSchema = z.object({
  adId: z.string().min(1, "ID do anuncio e obrigatorio"),
  couponCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { adId, couponCode } = checkoutSchema.parse(body)

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
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

    let finalPrice = PRICE_PER_AD

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
          maxUses: { gt: prisma.coupon.fields.timesUsed },
        },
      })

      if (coupon) {
        if (coupon.discountType === "PERCENTAGE") {
          finalPrice = PRICE_PER_AD * (1 - coupon.discountValue / 100)
        } else {
          finalPrice = Math.max(0, PRICE_PER_AD - coupon.discountValue)
        }
      }
    }

    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        status: "AWAITING_PAYMENT",
        paymentStatus: "PENDING",
        paymentAmount: finalPrice,
      },
    })

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000"

    const checkoutSession = await createCheckoutSession({
      adId: ad.id,
      adTitle: ad.title,
      customerEmail: session.user.email,
      customerName: ad.user.fullName || session.user.name || "Cliente",
      successUrl: `${baseUrl}/dashboard/anuncios/${ad.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/dashboard/anuncios/${ad.id}?payment=cancelled`,
      metadata: {
        userId: session.user.id,
        finalPrice: finalPrice.toString(),
      },
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      price: finalPrice,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Erro ao criar sessao de pagamento" }, { status: 500 })
  }
}
