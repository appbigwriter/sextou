import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const applyCouponSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  adId: z.string().min(1, "ID do anúncio é obrigatório"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { code, adId } = applyCouponSchema.parse(body)

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Cupom inválido" }, { status: 400 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Cupom inativo" }, { status: 400 })
    }

    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({ error: "Cupom expirado" }, { status: 400 })
    }

    if (coupon.timesUsed >= coupon.maxUses) {
      return NextResponse.json({ error: "Cupom atingiu limite de uso" }, { status: 400 })
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    })

    if (!ad || ad.userId !== session.user.id) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    let discount = 0
    if (coupon.discountType === "PERCENTAGE") {
      discount = (30 * coupon.discountValue) / 100
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discount = coupon.discountValue
    } else if (coupon.discountType === "FREE") {
      discount = 30
    }

    return NextResponse.json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice: 30,
      finalPrice: 30 - discount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Apply coupon error:", error)
    return NextResponse.json({ error: "Erro ao aplicar cupom" }, { status: 500 })
  }
}