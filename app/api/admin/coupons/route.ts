import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCouponSchema = z.object({
  code: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE"]),
  discountValue: z.number().positive("Valor deve ser positivo"),
  validFrom: z.string(),
  validUntil: z.string(),
  maxUses: z.number().positive("Limite de uso deve ser positivo"),
})

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Get coupons error:", error)
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createCouponSchema.parse(body)

    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    })

    if (existing) {
      return NextResponse.json({ error: "Código já existe" }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        maxUses: data.maxUses,
        isActive: true,
      },
    })

    return NextResponse.json(coupon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Create coupon error:", error)
    return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 })
  }
}